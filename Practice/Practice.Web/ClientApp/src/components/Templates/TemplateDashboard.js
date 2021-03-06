import React, { Component } from 'react';
import "./Template.css"
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

export class TemplateDashboard extends Component {
    static displayName = TemplateDashboard.name;

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error: null,
            TemplateType: 1,
            templates : null,
            overlay:0,
            templateId:null
        };

        
        this.title = "Template Dashboard";

        this.ChangeToQuestionTemplate=this.ChangeToQuestionTemplate.bind(this);
        this.ChangeToSurveyTemplate=this.ChangeToSurveyTemplate.bind(this);
        this.renderQuestionTemplateTable=this.renderQuestionTemplateTable.bind(this);
        this.renderSurveyTemplateTable=this.renderSurveyTemplateTable.bind(this);
        this.DeleteSurveyTemplate=this.DeleteSurveyTemplate.bind(this);
        this.DeleteQuestionTemplate=this.DeleteQuestionTemplate.bind(this);
        this.OverlayON=this.OverlayON.bind(this);
        this.Delete=this.Delete.bind(this);
        this.OverlayOFF=this.OverlayOFF.bind(this);
    }
        

    componentDidMount() {
        this.getSurveyTemplates();
    }

    //Get SurveyTemplates
    async getSurveyTemplates() {
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/SurveyTemplate/getAllSurveyTemplates',{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) this.setState({ error: "There are no templates!" });
        else {
            let temp = await response.json();

            let keys = Object.keys(temp);
            for (let key in keys)
            {
                temp[key].surveyTemplateId=temp[key].surveyTemplateId+"s";
            }
            this.setState({ loading: false, templates: temp});
            
        }
        
    }
    //Get QuestionTemplates
    async getQuestionTemplates() {
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response = await fetch('https://localhost:44309/QuestionTemplate/getAllQuestionTemplates',{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) this.setState({ error: "There are no templates!" });
        else {
            let temp = await response.json();
            let keys = Object.keys(temp);
            for (let key in keys)
            {
                temp[key].questionTemplateId=temp[key].questionTemplateId+"q";
            }
            this.setState({ loading: false, templates: temp});
        }
    }

    //Get Survey by id
    async getSurveyById(id)
    {
        const cookies = new Cookies();
        var token = cookies.get('token');
        const response= await fetch('https://localhost:44309/Survey/getSurvey/'+this.surveyId,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) this.setState({error:"Cant get a survey by id!"});
        else
        {
            this.surveyNames.push((await response.json()).title);
        }
    }
    
    

    //Generate Table
    renderSurveyTemplateTable(templates) {
        return (
            <table className="TemplateTable" key={1}>
                <thead>
                    <tr key="SurveyHead">
                        <th>Template Name</th><th>Create Date</th><th>Used</th><th></th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        templates.map(template=>
                            <tr key={template.surveyTemplateId}> 
                                <td>{template.name}</td>
                                <td>{template.createDate}</td>
                                <td>{template.used}</td>
                                <td><Link to={"/EditTemplate/"+parseInt(template.surveyTemplateId)}><button className="nav_button">Edit</button></Link></td>
                                <td><button id ={template.surveyTemplateId} onClick={this.OverlayON} className="nav_button">Delete</button></td>
                            </tr>
                            
                            )
                    }
                </tbody>
            </table>
            )
    }

    renderQuestionTemplateTable(templates) {
        return (
            <table className="TemplateTable" key={2}>
                <thead>
                    <tr key="QuestionHead">
                        <th>Template Name</th><th>Create Date</th><th>Used</th><th></th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        templates.map(template=>
                            <tr key={template.questionTemplateId}> 
                                <td>{template.label}</td>
                                <td>{template.createDate}</td>
                                <td>{template.used}</td>
                                <td><Link to={"./EditQuestionTemplate/"+parseInt(template.questionTemplateId)}><button id={template.questionTemplateId} className="nav_button">Edit</button></Link></td>
                                <td><button id={template.questionTemplateId} onClick={this.OverlayON} className="nav_button">Delete</button></td>
                            </tr>
                            )
                    }
                </tbody>
            </table>
            )
    }

    //Delete Template
    async DeleteSurveyTemplate()
    {
        const cookies = new Cookies();
        var token = cookies.get('token');
        
        await fetch('https://localhost:44309/SurveyTemplate/deleteSurveyTemplate/'+parseInt(this.state.templateId),{
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`
        }
       });
        this.getSurveyTemplates();
        
    }
    async DeleteQuestionTemplate(event)
    {
        const cookies = new Cookies();
        var token = cookies.get('token');
        await fetch('https://localhost:44309/QuestionTemplate/deleteQuestionTemplate/'+parseInt(this.state.templateId),{
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });
        this.getQuestionTemplates();
    }

    //Overlay

    renderOverlay()
    {
        return(
                <div id ="template_overlay">
                    <div id="template_container">
                        <div id="template_warning">
                            <p id="template_warning_message"> Delete template? </p>
                            <button id="template_yes" onClick={this.Delete}>Yes</button><button id="template_no" onClick={this.OverlayOFF}>No</button>
                            <br></br>
                            <br></br>
                        </div>
                    </div>
                </div>
        );
    }

    OverlayON(event)
    {
        this.setState({templateId:parseInt(event.target.id)});
        if (this.state.overlay===0) this.setState({overlay:1});
    }

    OverlayOFF()
    {
        if (this.state.overlay===1) this.setState({overlay:0});
    }

    Delete ()
    {
        if (this.state.TemplateType===1) this.DeleteSurveyTemplate();
        else this.DeleteQuestionTemplate();
        this.OverlayOFF();
    }

    //Change Template Type
    async ChangeToSurveyTemplate(event)
    {
        await this.getSurveyTemplates();
        if (this.state.TemplateType!==1) 
            this.setState({TemplateType:1});
    }
    
    async ChangeToQuestionTemplate(event)
    {
        await this.getQuestionTemplates();
        if (this.state.TemplateType!==2) 
            this.setState({TemplateType:2});
    }

    //Render
        render(){
            if (this.state.error) {
                return (
                    <div id="GeneralPieErrorContainer">
                        <div id="homepage_button_holder">
                            <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                        </div>
                        <h3 id="GeneralPieError">{this.state.error}</h3>
                    </div>
                );
            }
            else if (this.state.loading) {
                return (
                    <div id="GeneralPieErrorContainer">
                        <div id="homepage_button_holder">
                            <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                        </div>
                        <h3 id="GeneralPieError">Loading...</h3>
                    </div>
                );
            }
            else {
                
                let overlay=null;
                let table=null;
                var button1=null;
                var button2=null;
                if (this.state.TemplateType===1)
                {
                    table = this.renderSurveyTemplateTable(this.state.templates);   
                    button1=<button /*id="template_left_button"*/ className="nav_button button_left" onClick={this.ChangeToSurveyTemplate} style={{background:"#FF3CAC"}}>Surveys</button>;
                    button2=<button /*id="template_right_button"*/ className="nav_button button_right" onClick={this.ChangeToQuestionTemplate}>Questions</button>
                } 
                else 
                {
                    table=this.renderQuestionTemplateTable(this.state.templates);
                    button1=<button /*id="template_left_button"*/ className="nav_button button_left" onClick={this.ChangeToSurveyTemplate} >Surveys</button>;
                    button2=<button /*id="template_right_button"*/ className="nav_button button_right" onClick={this.ChangeToQuestionTemplate} style={{background:"#FF3CAC"}}>Questions</button>
                }

                if (this.state.overlay===1) overlay=this.renderOverlay();

                
                return (
                    <div>
                        <div id="homepage_button_holder">
                            <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                        </div>
                        <h2 id="title">{this.title}</h2>
                        {overlay}
                        <div id="template_buttons">
                            {button1}
                            {button2}
                        </div>
                        <div id='template_create_button_container'><Link to="/CreateSurvey"><button id="template_create_survey" className="nav_button">Create survey</button></Link></div>
                        <br></br>
                        {table}
                        
                    </div>
                    
                    );
            }
        }
    
}