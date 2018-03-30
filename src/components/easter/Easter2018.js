import React from 'react';
import EasterHunt, { questionTypes } from './EasterHunt';
import answerHint from './images/easter_2018_answer_hint.jpg';

const questions = [
    {
        text: 'Byrjum einfalt. Hvað er millinafn pabba Hjördísar?',
        answer: 'Benedikt',
    },
    {
        text: 'Vel gert. Næsta spurning. Hvað heitir forstjóri Mafíu Suðurlands?',
        answer: 'Ari Edwald',
    },
    {
        text: 'Ok þá. Hver er 11 aukastafur pí?',
        answer: '9',
    },
    {
        text: 'Ein alvöru. Hver var fyrsti forstjóri N1?',
        answer: 'Hermann Guðmundsson',
    },
    {
        text: 'Lísa er rjúpa. En hvað er rjúpa á ensku?',
        answer: 'Ptarmigan',
    },
    {
        text: 'Hvert fóru Ragga og Jónsi í brúðkaupsferð?',
        answer: 'Santorini',
    },
    {
        text: 'Spennó. Hvar eiga Kobbi og Sólrun sumarbústað?',
        answer: 'Laugarás',
    },
    {
        text: 'Þetta er mikilvægasta spurningin. Landsþing Miðflokksins er á næsta leyti. Hvenær er það?',
        answer: '21.-22. apríl',
        type: questionTypes.MULTIPLE_CHOICE,
        choices: [
            '1.-2. apríl',
            '10.-11. apríl',
            '16.-17. apríl',
            '21.-22. apríl',
            '28.-29. apríl',
        ],
    },
    {
        text: 'Landafræði? Hvað er langt á milli Vopnafjarðar og Kópaskers, í mílum (námundað)?',
        answer: '86',
    },
    {
        text: 'Nú fer þetta að verða búið. Hvar var hún Dorrit okkar fædd?',
        answer: 'Jerúsalem',
    },
].map((q, i) => ({
    type: questionTypes.TEXT,
    ...q,
    id: `${i + 1}`,
}));

const imgStyle = {
    maxHeight: '300px',
};

export default () => (
    <EasterHunt questions={questions}>
        <img src={answerHint} alt="Þetta ætti að vera nóg hint" style={imgStyle} />
    </EasterHunt>
);
