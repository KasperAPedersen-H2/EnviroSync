import React from 'react';
import { Box, Typography, styled } from '@mui/material';

// Styled components to match your CSS animations
const LoadingContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 0',
    width: '100%'
});

const LoadingSpinner = styled(Box)({
    position: 'relative',
    width: '70px',
    height: '70px',
    marginBottom: '20px'
});

const Circle = styled(Box)(({ index }) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '4px solid transparent',
    ...(index === 0 && {
        borderTopColor: 'var(--moonstone)',
        animation: 'spin 1.2s linear infinite'
    }),
    ...(index === 1 && {
        borderTopColor: 'transparent',
        borderRightColor: 'var(--silver-lake-blue)',
        animation: 'spin 1.2s linear infinite',
        animationDelay: '-0.3s'
    }),
    ...(index === 2 && {
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'var(--dark-cyan)',
        animation: 'spin 1.2s linear infinite',
        animationDelay: '-0.6s'
    }),
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
    }
}));

const LoadingText = styled(Typography)({
    fontSize: '18px',
    color: 'var(--text-medium)',
    position: 'relative',
    '&::after': {
        content: '"..."',
        position: 'absolute',
        width: '24px',
        textAlign: 'left',
        animation: 'dots 1.5s infinite'
    },
    '@keyframes dots': {
        '0%, 20%': { content: '"."' },
        '40%, 60%': { content: '".."' },
        '80%, 100%': { content: '"..."' }
    }
});

// The actual component to use
const LoadingSpinnerMUI = ({ text = "Loading" }) => {
    return (
        <LoadingContainer>
            <LoadingSpinner>
                <Circle index={0} />
                <Circle index={1} />
                <Circle index={2} />
            </LoadingSpinner>
            <LoadingText>{text}</LoadingText>
        </LoadingContainer>
    );
};

export default LoadingSpinnerMUI;