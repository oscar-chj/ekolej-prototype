"use client";

import { useState, useEffect } from "react";
import EventListService from "@/services/event/eventListService";
import { Event, EventStatus, EventCategory } from "@/types/api.types";
import { FilterState } from "./EventFilters";

export function useEvents() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedFilters, setAppliedFilters] = useState<FilterState>({
        dateFrom: "",
        dateTo: "",
        category: "" as EventCategory | "",
        organizer: "",
    });

    const fetchEvents = async (forceRefresh = false) => {
        try {
            setIsLoading(!forceRefresh);
            setIsRefreshing(forceRefresh);
            setError(null);

            const fetchedEvents = forceRefresh
                ? await EventListService.refreshEventList()
                : await EventListService.fetchEventList();

            setEvents(fetchedEvents);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load events.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleRefresh = () => fetchEvents(true);

    // Filter logic
    const processedEvents = events.filter((event) => {
        // Search
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const matches =
                event.title.toLowerCase().includes(searchLower) ||
                event.description.toLowerCase().includes(searchLower) ||
                event.organizer.toLowerCase().includes(searchLower) ||
                event.location.toLowerCase().includes(searchLower);
            if (!matches) return false;
        }

        // Filters
        if (appliedFilters.dateFrom && new Date(event.date) < new Date(appliedFilters.dateFrom)) return false;
        if (appliedFilters.dateTo && new Date(event.date) > new Date(appliedFilters.dateTo)) return false;
        if (appliedFilters.category && event.category !== appliedFilters.category) return false;
        if (appliedFilters.organizer && !event.organizer.toLowerCase().includes(appliedFilters.organizer.toLowerCase())) return false;

        return true;
    });

    const uniqueOrganizers = Array.from(new Set(events.map((e) => e.organizer))).sort();

    return {
        isLoading,
        error,
        isRefreshing,
        searchTerm,
        setSearchTerm,
        appliedFilters,
        setAppliedFilters,
        handleRefresh,
        uniqueOrganizers,
        upcomingEvents: processedEvents.filter((e) => e.status === EventStatus.UPCOMING),
        ongoingEvents: processedEvents.filter((e) => e.status === EventStatus.ONGOING),
        completedEvents: processedEvents.filter((e) => e.status === EventStatus.COMPLETED),
    };
}
