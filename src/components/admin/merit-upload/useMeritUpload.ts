"use client";

import { useState, useEffect, useRef } from "react";
import eventService from "@/services/event/eventService";
import { Event, EventCategory, Student, EventStatus } from "@/types/api.types";
import { RegistrationStatus } from "@/types/registration.types";
import { uploadMeritAction } from "@/app/actions/meritActions";

export interface ParticipantMeritEntry {
    studentId: string;
    studentName: string;
    points: number;
    meritType: string;
    role: "Participant" | "Organizer";
    isValid: boolean;
    status: "valid" | "invalid";
    errors?: string[];
    errorMessage?: string;
}

export interface MeritWeightage {
    participantPoints: number;
    organizerPoints: number;
    meritType: string;
    maxPointsThreshold: number;
}

export function useMeritUpload(eventId?: string, onComplete?: (data: { validEntries: ParticipantMeritEntry[], event: Event }) => void) {
    const [activeStep, setActiveStep] = useState(0);
    const [participantData, setParticipantData] = useState<ParticipantMeritEntry[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [completedEvents, setCompletedEvents] = useState<Event[]>([]);
    const [meritWeightage, setMeritWeightage] = useState<MeritWeightage>({
        participantPoints: 5,
        organizerPoints: 8,
        meritType: "University",
        maxPointsThreshold: 20,
    });

    // In-memory cache for student data to avoid redundant fetches
    const studentCache = useRef<Map<string, Student>>(new Map());

    useEffect(() => {
        const fetchCompletedEvents = async () => {
            try {
                const response = await eventService.getEvents(
                    { page: 1, limit: 1000 },
                    { status: EventStatus.COMPLETED }
                );
                if (response.success && response.data) {
                    setCompletedEvents(response.data);
                }
            } catch (error) {
                console.error("Error fetching completed events:", error);
            }
        };
        fetchCompletedEvents();

        if (eventId) {
            const fetchEvent = async () => {
                try {
                    const response = await eventService.getEventById(eventId);
                    if (response.success && response.data) {
                        handleEventSelect(response.data);
                        setActiveStep(1);
                    }
                } catch (error) {
                    console.error("Error fetching event:", error);
                }
            };
            fetchEvent();
        }
    }, [eventId]);

    const updateMeritWeightageForEvent = (event: Event) => {
        let eventMeritType = "University";
        let defaultParticipantPoints = 5;
        let defaultOrganizerPoints = 8;
        let maxThreshold = 20;

        switch (event.category) {
            case EventCategory.UNIVERSITY:
                eventMeritType = "University";
                defaultParticipantPoints = 8;
                defaultOrganizerPoints = 12;
                maxThreshold = 25;
                break;
            case EventCategory.FACULTY:
                eventMeritType = "Faculty";
                defaultParticipantPoints = 6;
                defaultOrganizerPoints = 10;
                maxThreshold = 20;
                break;
            case EventCategory.COLLEGE:
                eventMeritType = "College";
                defaultParticipantPoints = 4;
                defaultOrganizerPoints = 7;
                maxThreshold = 15;
                break;
            case EventCategory.CLUB:
                eventMeritType = "Club";
                defaultParticipantPoints = 3;
                defaultOrganizerPoints = 5;
                maxThreshold = 10;
                break;
        }

        setMeritWeightage({
            participantPoints: defaultParticipantPoints,
            organizerPoints: defaultOrganizerPoints,
            meritType: eventMeritType,
            maxPointsThreshold: maxThreshold,
        });
    };

    const validateParticipantEntries = (
        entries: Omit<ParticipantMeritEntry, "isValid" | "status" | "errors" | "errorMessage">[]
    ): ParticipantMeritEntry[] => {
        const validatedEntries: ParticipantMeritEntry[] = [];
        const seenStudentIds = new Set<string>();

        entries.forEach((entry) => {
            const errors: string[] = [];
            let isValid = true;

            if (seenStudentIds.has(entry.studentId)) {
                errors.push("Duplicate entry for student");
                isValid = false;
            } else {
                seenStudentIds.add(entry.studentId);
            }

            if (entry.points > meritWeightage.maxPointsThreshold) {
                errors.push(`Points exceed maximum threshold (${meritWeightage.maxPointsThreshold})`);
                isValid = false;
            }

            if (entry.points <= 0) {
                errors.push("Points must be positive");
                isValid = false;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const existingErrors = (entry as any).errors || [];
            const allErrors = [...existingErrors, ...errors];

            validatedEntries.push({
                ...entry,
                isValid: isValid && allErrors.length === 0,
                status: isValid && allErrors.length === 0 ? "valid" : "invalid",
                errors: allErrors.length > 0 ? allErrors : undefined,
                errorMessage: allErrors.length > 0 ? allErrors[0] : undefined,
            });
        });

        return validatedEntries;
    };

    const fetchStudentDataWithCache = async (studentId: string): Promise<Student | null> => {
        if (studentCache.current.has(studentId)) {
            return studentCache.current.get(studentId)!;
        }

        try {
            const response = await fetch(`/api/students/by-id/${studentId}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    studentCache.current.set(studentId, result.data);
                    return result.data;
                }
            }
        } catch (error) {
            console.error(`Error fetching student ${studentId}:`, error);
        }
        return null;
    };

    const getEventParticipants = async (): Promise<ParticipantMeritEntry[]> => {
        if (!selectedEvent) return [];

        try {
            const registrationsResponse = await eventService.getEventRegistrations(
                selectedEvent.id,
                { page: 1, limit: 1000 }
            );

            if (!registrationsResponse.success || !registrationsResponse.data) {
                return [];
            }

            const attendedRegistrations = registrationsResponse.data.filter(
                (reg) => reg.status === RegistrationStatus.ATTENDED
            );

            // Parallelize student data fetching
            const participantPromises = attendedRegistrations.map(async (registration) => {
                const student = await fetchStudentDataWithCache(registration.studentId);

                if (student) {
                    return {
                        studentId: student.studentId || student.id,
                        studentName: student.name,
                        points: meritWeightage.participantPoints,
                        meritType: meritWeightage.meritType,
                        role: "Participant" as const,
                        isValid: true,
                        status: "valid" as const,
                    };
                } else {
                    return {
                        studentId: registration.studentId,
                        studentName: "Unknown",
                        points: meritWeightage.participantPoints,
                        meritType: meritWeightage.meritType,
                        role: "Participant" as const,
                        isValid: false,
                        status: "invalid" as const,
                        errors: ["Student not found"],
                    };
                }
            });

            const participants = await Promise.all(participantPromises);
            return validateParticipantEntries(participants);
        } catch (error) {
            console.error("Error fetching event participants:", error);
            return [];
        }
    };

    const handleEventSelect = (event: Event) => {
        setSelectedEvent(event);
        updateMeritWeightageForEvent(event);
        setActiveStep(1);
    };

    const handleWeightageNext = async () => {
        setIsProcessing(true);
        try {
            const participants = await getEventParticipants();
            setParticipantData(participants);
            setActiveStep(2);
        } catch (error) {
            console.error("Error loading participants:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRoleChange = (index: number, newRole: "Participant" | "Organizer") => {
        const updatedData = [...participantData];
        updatedData[index] = {
            ...updatedData[index],
            role: newRole,
            points: newRole === "Participant" ? meritWeightage.participantPoints : meritWeightage.organizerPoints,
        };
        setParticipantData(validateParticipantEntries(updatedData));
    };

    const handleSubmitMerit = async () => {
        setIsProcessing(true);
        try {
            const validEntries = participantData.filter((e) => e.status === "valid");
            // Use the Server Action
            const result = await uploadMeritAction(
                validEntries.map(e => ({
                    studentId: e.studentId,
                    points: e.points,
                    category: selectedEvent!.category,
                    meritType: e.meritType,
                    description: `Merit for ${selectedEvent!.title}`
                })),
                selectedEvent!.id
            );

            if (result.success) {
                setActiveStep(3);
                if (onComplete && selectedEvent) {
                    onComplete({ validEntries, event: selectedEvent });
                }
            } else {
                alert(result.error || "Failed to upload merits");
            }
        } catch (error) {
            console.error("Error submitting merits:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        activeStep,
        setActiveStep,
        participantData,
        setParticipantData,
        isProcessing,
        selectedEvent,
        setSelectedEvent,
        completedEvents,
        meritWeightage,
        setMeritWeightage,
        handleEventSelect,
        handleWeightageNext,
        handleRoleChange,
        handleSubmitMerit,
        validEntries: participantData.filter((e) => e.status === "valid"),
        invalidEntries: participantData.filter((e) => e.status === "invalid"),
    };
}
