
import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
    <div className="tabs-navigation">
        {tabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'tab-button-active' : ''}`}
            >
                {tab.label}
            </button>
        ))}
    </div>
);

export default TabNavigation;