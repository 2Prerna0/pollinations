import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Typography, TextareaAutosize, Button, CircularProgress } from '@mui/material';
import { Colors } from '../../../styles/global';
import { AdvancedOptions } from './AdvancedOptions';

export function ImageEditor({ image, handleParamChange, handleFocus, isLoading, handleSubmit }) {
    const { prompt, imageURL, seed } = image;
    const [isInputChanged, setIsInputChanged] = useState(false);

    useEffect(() => {
        setIsInputChanged(false);
    }, [imageURL]);

    const handleInputChange = (param, value) => {
        setIsInputChanged(true);
        handleParamChange(param, value);
    };

    const handleButtonClick = () => {
        if (!isInputChanged) {
            // If no input has changed, increment the seed
            handleParamChange('seed', (seed || 0) + 1);
        }
        setTimeout(handleSubmit, 250);
    };

    if (!imageURL) {
        return <Typography variant="body2" color="textSecondary">Loading...</Typography>;
    }

    return (
        <Box component={Paper} style={{ border: 'none', boxShadow: 'none', marginTop: '0px', backgroundColor: "transparent" }}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">Prompt</Typography>
                    <TextareaAutosize
                        minRows={3}
                        style={{ width: '100%', backgroundColor: 'transparent', color: Colors.white, padding: '10px', fontSize: '1.1rem' }}
                        value={prompt}
                        onChange={(e) => handleInputChange('prompt', e.target.value)}
                        onFocus={handleFocus}
                        disabled={isLoading}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleButtonClick}
                            disabled={isLoading}
                            style={{
                                backgroundColor: isInputChanged ? null : Colors.lime,
                                color: isInputChanged ? null : Colors.offblack,
                                padding: '10px 20px',
                                display: isLoading ? 'none' : 'block'
                            }}
                        >
                            {isInputChanged ? 'Imagine' : 'Re-Imagine'}
                        </Button>
                        {isLoading && <CircularProgress color={'inherit'} style={{ color: Colors.lime }} />}
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <AdvancedOptions
                        image={image}
                        handleParamChange={handleInputChange}
                        handleFocus={handleFocus}
                        isLoading={isLoading}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}