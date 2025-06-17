document.addEventListener('DOMContentLoaded', function() {
    console.log('Bridge Quiz JavaScript loaded!');
    
    const quizDataElement = document.getElementById('quiz-data');
    if (quizDataElement) {
        console.log('Quiz data element found!');
        const quizData = JSON.parse(quizDataElement.value);
        console.log('Quiz data:', quizData);
    } else {
        console.error('Quiz data element not found!');
    }
});
