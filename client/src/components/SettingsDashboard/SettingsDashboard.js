import React from "react";
import {
    Box,
    Switch,
    FormControlLabel,
    Typography,
    Paper,
    Divider,
    Slider,
} from "@mui/material";
import { useDataLimit } from "../../context/DataLimitContext"; // Import context


const SettingsDashboard = ({ darkMode, onDarkModeToggle }) => {
    const { dataLimit, setDataLimit } = useDataLimit(); // Hent context

    const handleSliderChange = (event, newValue) => {
        setDataLimit(newValue); // Opdater dataLimit værdien
    };


    return (
        <Box sx={{ p: 3, maxWidth: 600, margin: "0 auto" }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Indstillinger
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {/* Dark Mode Toggle */}
                <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={darkMode}
                                onChange={onDarkModeToggle}
                                color="primary"
                            />
                        }
                        label="Dark Mode"
                    />
                </Box>

                {/* Slider for Data Limit */}
                <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>Data Point Limit</Typography>
                    <Slider
                        value={dataLimit}
                        onChange={handleSliderChange}
                        min={5}
                        max={100}
                        step={5}
                        valueLabelDisplay="auto"
                    />
                </Box>

            </Paper>
        </Box>
    );
};

export default SettingsDashboard;