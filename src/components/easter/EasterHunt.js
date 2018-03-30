import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const storage = window.localStorage;
const inputElementId = 'formElement';

export const questionTypes = {
    TEXT: 'text',
    MULTIPLE_CHOICE: 'multiple_choice',
};


const setAnswers = questionAnswers => storage.setItem('questionAnswers', JSON.stringify(questionAnswers));


const getAnswers = (isRetry) => {
    const storageData = storage.getItem('questionAnswers') || '{}';
    try {
        return JSON.parse(storageData);
    } catch (e) {
        if (!isRetry) {
            setAnswers({});
            return getAnswers(true);
        }
        throw e;
    }
};

const sanitize = answer => answer.toLowerCase().replace(/^\s+|\s+$/g, '');


export default class Easter extends Component {
    static propTypes = {
        questions: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string.isRequired,
            type: PropTypes.oneOf(Object.values(questionTypes)).isRequired,
            answer: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
        })).isRequired,
        children: PropTypes.node.isRequired,
    }

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.clearAnswers = this.clearAnswers.bind(this);
        this.state = {
            currentAnswer: '',
            currentQuestion: null,
            badAnswer: false,
        };
    }

    componentWillMount() {
        this.updateFromStorage();
    }

    onChange(event) {
        this.setState({ currentAnswer: event.target.value });
    }

    onKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this.checkAnswer();
        }
    }

    getNextUnanswered(questionAnswers) {
        const { questions } = this.props;
        return questions.find(question => !questionAnswers[question.id]);
    }

    updateFromStorage() {
        const questionAnswers = getAnswers();
        const currentQuestion = this.getNextUnanswered(questionAnswers || {});
        const currentAnswer = '';
        return this.setState({ currentQuestion, currentAnswer });
    }

    checkAnswer() {
        const { currentAnswer, currentQuestion } = this.state;
        if (sanitize(currentQuestion.answer) === sanitize(currentAnswer)) {
            const questionAnswers = getAnswers();
            questionAnswers[currentQuestion.id] = currentAnswer;
            setAnswers(questionAnswers);
            this.updateFromStorage();
        } else {
            this.setState({ badAnswer: true });
            setTimeout(() => this.setState({ badAnswer: false }), 2000);
        }
    }

    clearAnswers() {
        setAnswers({});
        this.updateFromStorage();
    }

    renderTextQuestion(question, elementId) {
        const { currentAnswer } = this.state;
        return (
            <div>
                <p>{question.text}</p>
                <p><input type="text" value={currentAnswer || ''} onChange={this.onChange} onKeyDown={this.onKeyDown} id={elementId} /></p>
            </div>
        );
    }

    renderMultipleChoiceQuestion(question, elementId) {
        const { currentAnswer } = this.state;
        return (
            <div>
                <p>{question.text}</p>
                {question.choices.map(choice => (
                    <p>
                        <input
                            type="radio"
                            name={elementId}
                            checked={choice === currentAnswer}
                            value={choice}
                            onChange={this.onChange}
                        />{choice}
                    </p>
                ))}
            </div>
        );
    }

    renderControls() {
        const { badAnswer } = this.state;
        if (badAnswer) {
            return <div><span style={{ color: 'red' }}>Rangt!</span></div>;
        }
        return (
            <div>
                <Button bsStyle="success" onClick={this.checkAnswer}>Svara!</Button>
                <br />
                <br />
                <br />
                <Button bsStyle="danger" onClick={this.clearAnswers}>Hreinsa öll svör</Button>
            </div>
        );
    }

    renderQuestion(question, elementId) {
        switch (question.type) {
        case questionTypes.TEXT:
            return this.renderTextQuestion(question, elementId);
        case questionTypes.MULTIPLE_CHOICE:
            return this.renderMultipleChoiceQuestion(question, elementId);
        default:
            return 'No render function, wtf';
        }
    }

    renderAnswers() {
        const { children, questions } = this.props;
        const spanStyle = {
            display: 'block',
            marginTop: '5px',
        };
        return (
            <div>
                <h2>Páskar! Já vei!</h2>
                <div style={{ marginBottom: '50px' }}>
                    {children}
                </div>
                <h4>Öll svör:</h4>
                {questions.map(q => <span style={spanStyle}>{q.text}: <b>{q.answer}</b></span>)}
                <Button bsStyle="danger" onClick={this.clearAnswers}>Byrja aftur</Button>
            </div>
        );
    }

    render() {
        const { currentQuestion } = this.state;
        if (!currentQuestion) {
            // Done
            return this.renderAnswers();
        }
        return (
            <div>
                <label htmlFor={inputElementId}>
                    {this.renderQuestion(currentQuestion, inputElementId)}
                </label>
                {this.renderControls()}
            </div>
        );
    }
}
