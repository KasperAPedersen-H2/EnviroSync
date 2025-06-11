import React from "react";
import {
    Box,
    Switch,
    FormControlLabel,
    Typography,
    Paper,
    Divider,
} from "@mui/material";

const SettingsDashboard = ({ darkMode, onDarkModeToggle }) => {
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
            </Paper>
        </Box>
    );
};

export default SettingsDashboard;