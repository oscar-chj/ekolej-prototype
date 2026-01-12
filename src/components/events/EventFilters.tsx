"use client";

import { Box, TextField, InputAdornment, IconButton, Button, Collapse, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Search, Clear, FilterList } from "@mui/icons-material";
import { EventCategory } from "@/types/api.types";
import { getCategoryDisplayName } from "@/lib/categoryUtils";
import { useState } from "react";

export interface FilterState {
    dateFrom: string;
    dateTo: string;
    category: EventCategory | "";
    organizer: string;
}

interface EventFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    appliedFilters: FilterState;
    setAppliedFilters: (filters: FilterState) => void;
    uniqueOrganizers: string[];
}

export function EventFilters({
    searchTerm,
    setSearchTerm,
    appliedFilters,
    setAppliedFilters,
    uniqueOrganizers,
}: EventFiltersProps) {
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState<FilterState>(appliedFilters);

    const handleApplyFilters = () => {
        setAppliedFilters(tempFilters);
        setFilterDialogOpen(false);
    };

    const handleClearFilters = () => {
        const empty: FilterState = { dateFrom: "", dateTo: "", category: "", organizer: "" };
        setTempFilters(empty);
        setAppliedFilters(empty);
        setSearchTerm("");
        setFilterDialogOpen(false);
    };

    const hasActiveFilters = searchTerm.trim() !== "" || Object.values(appliedFilters).some(v => v !== "");

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setSearchTerm("")} size="small"><Clear /></IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => {
                        setTempFilters(appliedFilters);
                        setFilterDialogOpen(true);
                    }}
                    sx={{ minWidth: 120 }}
                >
                    Filters
                </Button>
            </Box>

            <Collapse in={hasActiveFilters}>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center", mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Active filters:</Typography>
                    {searchTerm && <Chip label={`Search: "${searchTerm}"`} onDelete={() => setSearchTerm("")} size="small" variant="outlined" />}
                    {appliedFilters.category && (
                        <Chip label={`Category: ${getCategoryDisplayName(appliedFilters.category)}`} onDelete={() => setAppliedFilters({ ...appliedFilters, category: "" })} size="small" variant="outlined" />
                    )}
                    {appliedFilters.organizer && (
                        <Chip label={`Organizer: ${appliedFilters.organizer}`} onDelete={() => setAppliedFilters({ ...appliedFilters, organizer: "" })} size="small" variant="outlined" />
                    )}
                    <Button size="small" onClick={handleClearFilters} color="secondary">Clear All</Button>
                </Box>
            </Collapse>

            <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Filter Events</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                type="date" label="From" value={tempFilters.dateFrom} fullWidth InputLabelProps={{ shrink: true }}
                                onChange={(e) => setTempFilters({ ...tempFilters, dateFrom: e.target.value })}
                            />
                            <TextField
                                type="date" label="To" value={tempFilters.dateTo} fullWidth InputLabelProps={{ shrink: true }}
                                onChange={(e) => setTempFilters({ ...tempFilters, dateTo: e.target.value })}
                            />
                        </Box>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={tempFilters.category} label="Category"
                                onChange={(e) => setTempFilters({ ...tempFilters, category: e.target.value as EventCategory | "" })}
                            >
                                <MenuItem value=""><em>All Categories</em></MenuItem>
                                {Object.values(EventCategory).map((cat) => (
                                    <MenuItem key={cat} value={cat}>{getCategoryDisplayName(cat)}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Organizer</InputLabel>
                            <Select
                                value={tempFilters.organizer} label="Organizer"
                                onChange={(e) => setTempFilters({ ...tempFilters, organizer: e.target.value })}
                            >
                                <MenuItem value=""><em>All Organizers</em></MenuItem>
                                {uniqueOrganizers.map((org) => <MenuItem key={org} value={org}>{org}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClearFilters} color="secondary">Clear All</Button>
                    <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleApplyFilters} variant="contained">Apply Filters</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
