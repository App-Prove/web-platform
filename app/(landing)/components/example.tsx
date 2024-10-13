import React from 'react';

const AppProve: React.FC = () => {
    return (
        <div className="app-prove">
            <header>
                <h1>App-Prove</h1>
                <p>Codebase pre-analysis</p>
                <button className="fix-button">Fix with auditors</button>
            </header>

            <main>
                <div className="status-section">
                    <div className="status-item">
                        <span className="status-icon success"></span>
                        <span>Successfully connected</span>
                    </div>
                    <div className="status-item">
                        <span className="status-icon success"></span>
                        <span>Successfully cloned</span>
                    </div>
                    <div className="status-item">
                        <span className="status-icon success"></span>
                        <span>Success</span>
                    </div>
                    <div className="progress">
                        <span className="progress-text">4 of 23 files checked</span>
                        <div className="progress-bar"></div>
                    </div>
                </div>

                <div className="details-section">
                    <h2>Details</h2>
                    <div className="code-preview">
                        {/* Placeholder for code preview */}
                        <pre>
                            <code>
                                {`// Code preview goes here
function Component() {
  // ...
}`}
                            </code>
                        </pre>
                    </div>
                </div>

                <div className="analysis-summary">
                    <h2>Analysis report summary</h2>
                    <p>Using best scored large language models in code analysis, we ensure code meets quality standards.</p>
                    <p>You will get a full report regarding found issues and independent developers are going to give you in-depth recommendation to improve your code.</p>
                    <div className="issue-summary">
                        <p className="security-flaws">security flaws: 1</p>
                        <p className="bugs-found">bug found: 3</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppProve;

