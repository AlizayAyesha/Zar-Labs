import { Cone, Globe, User, Zap } from 'lucide-react';

export const SectionKPI = () => {
    return (
        <section className="kpi">
            <div className="kpi-content">
                <div className="textbox">
                    <div className="subheadline-box opacity-blur">
                        <Zap className="subheadline-box-icon" />
                        <h2 className="small-description grey" >Key Performance Indicators</h2>
                    </div>
                    <div className="titlebox">
                        <div className="titlebox-gradient" />
                        <h1 className="subheadline white">Numbers That Just Make Sense</h1>
                    </div>
                </div>
                <div className="kpi-content-row">
                    <div className="kpi-content-item">
                        <div className="kpi-item-textbox">
                            <div className="kpi-item-textbox-top">
                                <div className="kpi-item-textbox-number">
                                    <h2 className="headline kpi-item-textbox-number-text white" >250</h2>
                                    <div className="kpi-item-textbox-number-gradient" />
                                </div>
                                <h3 className="small-subheadline kpi-item-textbox-top-text white" >thousand</h3>
                            </div>
                            <p className="description grey" >of data processed by our <br /> models every single month</p>
                        </div>
                        <div className="kpi-item-button" >
                            <Globe className="kpi-item-button-icon" />
                        </div>
                        <div className="kpi-item-grid" />
                    </div>
                    <div className="kpi-content-item">
                        <div className="kpi-item-textbox">
                            <div className="kpi-item-textbox-top">
                                <div className="kpi-item-textbox-number">
                                    <h2 className="headline kpi-item-textbox-number-text white" >$100</h2>
                                    <div className="kpi-item-textbox-number-gradient" />
                                </div>
                                <h3 className="small-subheadline kpi-item-textbox-top-text white" >million</h3>
                            </div>
                            <p className="description grey" >client revenue driven by our <br /> tailored solutions and strategies.</p>
                        </div>
                        <div className="kpi-item-button" >
                            <User className="kpi-item-button-icon" />
                        </div>
                        <div className="kpi-item-grid" />
                    </div>
                    <div className="kpi-content-item">
                        <div className="kpi-item-textbox">
                            <div className="kpi-item-textbox-top">
                                <div className="kpi-item-textbox-number">
                                    <h2 className="headline kpi-item-textbox-number-text white" >500</h2>
                                    <div className="kpi-item-textbox-number-gradient" />
                                </div>
                                <h3 className="small-subheadline kpi-item-textbox-top-text white" >million</h3>
                            </div>
                            <p className="description grey" >users continuously running our <br /> customized GPT tool.</p>
                        </div>
                        <div className="kpi-item-button" >
                            <Cone className="kpi-item-button-icon" />
                        </div>
                        <div className="kpi-item-grid" />
                    </div>
                </div>
            </div>
        </section>
    );
};
