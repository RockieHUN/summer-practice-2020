import React, {Component} from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import "./GeneralPieChart.css"
import Cookies from 'universal-cookie';

export class GeneralPie extends Component
{
    static displayName = GeneralPie.name; 

    constructor(props)
    {
        super(props);
        this.state={
            loading:true,
            error:null,
            SurveyId:this.props.surveyId,
            answers: null,
            SurveyTitle: null,
            QuestionList: null,
            EnabledQuestions: null
        };

        this.title="GeneralPie";

        this.GetAnswer=this.GetAnswer.bind(this);
        this.GenerateQuestions=this.GenerateQuestions.bind(this);
        this.GenerateOptions=this.GenerateOptions.bind(this);
        this.DisplayQuestions=this.DisplayQuestions.bind(this);
        this.GenerateData=this.GenerateData.bind(this);
        this.ModifyList=this.ModifyList.bind(this);
        this.AddOrRemove=this.AddOrRemove.bind(this);
        this.IsEnabled=this.IsEnabled.bind(this);
    }

    componentDidMount()
    {
        this.GetAnswer();

    }

    //Get Answers
    async GetAnswer()
    {
        const cookies = new Cookies();
        var token = cookies.get('token');

        const response = await fetch ('https://localhost:44309/Answer/getAnswerById/'+this.state.SurveyId,
        {
        headers: {
            'Authorization': `Bearer ${token}`
        }});

        const response2= await fetch ('https://localhost:44309/Survey/getSurvey/'+this.state.SurveyId,{
            headers: {
                'Authorization': `Bearer ${token}`
            }});


        if (!response.ok || !response2.ok) this.setState({error:"Error: Request failed or the survey doesn't exists"});
        else
        {
            var temp;
            var survey ;
            try
            {
               temp= await response.json();
               survey = await response2.json();
            }
            catch(err)
            {
                this.setState({error:"There are no answers for this survey"});
                return;
            }
           

            var List=this.GenerateQuestions(temp);
            var List2=this.GenerateQuestions(temp);
            if (List.length===0) this.setState({loading:false,error:"There is no question with type of 'Rating' in this survey"});
            else
            this.setState({loading:false,answers:temp,SurveyTitle:survey.title,QuestionList:List,EnabledQuestions:List2});
        } 
       
    }

    //Generate Questions
    GenerateQuestions(temp)
    {
        var pages=temp.answers[0].pages;
        var QList=[];

        for (var i=0;i<pages.length;i++)
        {
            for (var j=0; j<pages[i].questions.length; j++)
            {
                if (pages[i].questions[j].type==="rating") QList.push(pages[i].questions[j].label)
            }
        }
        return QList;
    }


    //Render questions
    DisplayQuestions()
    {
        return(
            this.state.QuestionList.map(question =>
            {   
                if(this.IsEnabled(question))
                {
                    return <button key={question} className="PieQuestionLabel" onClick={this.AddOrRemove} style={{backgroundColor:"#0ec900",color:"white"}} name={question}>{question}</button>
                }
                else
                {
                    return <button key={question} className="PieQuestionLabel" onClick={this.AddOrRemove} style={{backgroundColor:"white"}} name={question}>{question}</button>
                }
            }
            
                )
        );
    }

    //Add or remove question from list
    AddOrRemove(event)
    {
        var list=this.state.EnabledQuestions;
        var logical=false;

        if (list.length===1)
        {
            for (let i=0 ; i<list.length;i++)
            {
                if (event.target.name===list[i])
                {
                    logical=true;
                }
            }
            if (!logical)
            {
                list.push(event.target.name);
            }
            this.setState({EnabledQuestions:list});

            return;
        } 
        
        for (let i=0 ; i<list.length;i++)
        {
            if (event.target.name===list[i])
            {
                list.splice(i,1);
                logical=true;
            }
        }
        if (logical===false)
        {
            list.push(event.target.name);
        }
        console.log(list);
        this.setState({EnabledQuestions:list});
    }

    //Generate Data
    GenerateData()
    {
        var data=[
            {
                name:1,
                y:0
            },
            {
                name:2,
                y:0
            },
            {
                name:3,
                y:0
            },
            {
                name:4,
                y:0
            },
            {
                name:5,
                y:0
            }

        ];

        for (var i =0; i<this.state.answers.answers.length; i++)
        {
            for (var j=0; j<this.state.answers.answers[i].pages.length;j++)
            {
                for (var k=0; k<this.state.answers.answers[i].pages[j].questions.length;k++)
                {
                    if (this.IsEnabled(this.state.answers.answers[i].pages[j].questions[k].label))
                    {
                        for (var l=0;l<this.state.answers.answers[i].pages[j].questions[k].answers.length;l++)
                        {
                            data=this.ModifyList(this.state.answers.answers[i].pages[j].questions[k].answers[l].answerId,data);
                        }
                    }
                }
            }
        }
        

        return data;
    }

    IsEnabled(question)
    {
        for (var i=0;i<this.state.EnabledQuestions.length;i++)
        {
            if (this.state.EnabledQuestions[i]===question) return true;
        }
        return false;
    }

    ModifyList(answer,list)
    {
        var logical=false;
        for (var i=0;i<list.length;i++)
        {
            if(list[i].name===answer)
            {
                logical=true;
                list[i].y=list[i].y+1;
            }
        }
        if (logical===false)
        {
            list.push({name:answer,y:1});
        }
        return list;
    }


    //Generate options
    GenerateOptions(data)
    {
        return {
            chart:{
                type:"pie",
                backgroundColor: 'transparent'
            },
            title:{
                text:"Results:",
                style: {
                    color: 'white'
                }
            },
            tooltip: {
                pointFormat: '<b>{point.name}</b>: {point.percentage:.1f}%'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true,
                    labels: {
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            series:[
                {
                   name:"Percentage",
                   data:data
                }
            ]
        };
    }

    render()
    {      
        if (this.state.error)
        {
            return (
                <div id="GeneralPieErrorContainer">
                    <h3 id="GeneralPieError">{this.state.error}</h3>
                </div>
            );
        }
        else 
        {
            if (this.state.loading)
            {
                return (
                    <div id="GeneralPieErrorContainer">
                        <h3 id="GeneralPieError">Loading...</h3>
                    </div>
                );
            }
            else
            {
                var questions=this.DisplayQuestions();
                const options = this.GenerateOptions(this.GenerateData());
                return (
                    <div>
                        {/*<div id="homepage_button_holder">
                            <Link to="/MainMenu" className="Link"><button id="homepage_button">Home page</button></Link>
                        </div>*/}
                        <h2 id="title">{this.state.SurveyTitle}</h2>
                        <br></br>
                        <br></br>
                        <HighchartsReact id="GeneralPieChart" highcharts={Highcharts} options={options} />
                        <div id="PieQuestionContainer">
                            {questions}
                        </div>
                    </div>
                );
            }
            
        }
        

    }

    
}