import React, { useState, useEffect } from 'react';
import './toggleSwitch.css';

const ToggleSwitch: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        if (isDarkMode) 
            document.documentElement.classList.add('dark-mode');
        else 
            document.documentElement.classList.remove('dark-mode');
    }, [isDarkMode]);

    const handleToggle = () => {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <label className="switch">
            <input type="checkbox" checked={isDarkMode} onChange={handleToggle} />
            <span className="slider round"></span>
        </label>
    )

}

export default ToggleSwitch;