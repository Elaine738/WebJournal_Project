const chatBox = document.getElementById('webchat');
const userInput = document.getElementById('userInput');
const knowledgeBase = "https://webjournal-language-service.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=KnowledgeBase-Journal-Chatbot&api-version=2021-10-01&deploymentName=production";
      
userInput.addEventListener('keypress', async function (e) {

    if (e.key === 'Enter') {
        const message = userInput.value.trim();
        if (!message) return;
        giveAnswer('You', message);
        userInput.value = '';

        $.ajax({
            url: knowledgeBase,
            method: 'POST',
            headers: {
              'Ocp-Apim-Subscription-Key': "4aK0ZtqYkINXBNVRn0XkzVwVNVOoMCrMx7jKizZHruaBjIkJUXutJQQJ99BCACmepeSXJ3w3AAAaACOGn4fT"
            },
            contentType: 'application/json',
            data: JSON.stringify({
              question: message,
              top: 1
            }),
            success: function (data) {
                const answer = data.answers?.[0]?.answer;
                giveAnswer('WebJournal', answer);
            },
            error: function(error){
                console.error(error);
                giveAnswer('WebJournal', 'Sorry, there was an error fetching the answer.');
            }
        });
      }
    });
    function giveAnswer(sender, text) {
        const msg = document.createElement('div');
        msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
        msg.style.marginBottom = '8px';
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    