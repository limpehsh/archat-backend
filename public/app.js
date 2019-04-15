const socket = io();
const client = feathers();

client.configure(feathers.socketio(socket));

const messages = client.service('messages');

client.configure(feathers.authentication({
	storage: window.localStorage
}));

client.authenticate({
	strategy: 'local',
	email: 'feathers@example.com',
	password: 'secret'
}).then((token) => {
	console.log('User is logged in', token);

	messages.find().then(page => page.data.forEach(addMessage));
	messages.on('created', addMessage);

});

function addMessage(message) {
	const chat = document.querySelector('.chat');

	chat.insertAdjacentHTML('beforeend', `<div class="message flex flex-row">
		<img src="https://placeimg.com/64/64/any" alt="${message.name}" class="avatar">
			<div class="message-wrapper">
				<p class="message-header">
					<span class="username font-600">${message.name}</span>
				</p>
				<p class="message-content font-300">${message.text}</p>
			</div>
		</div>`);

	chat.scrollTop = chat.scrollHeight - chat.clientHeight;

}

document.getElementById('send-message').addEventListener('submit', function(ev) {
	const nameInput = document.querySelector('[name="name"]');
	const textInput = document.querySelector('[name="text"]');

	client.service('messages').create({
		text: textInput.value,
		name: nameInput.value
	}).then(() => {
		textInput.value = '';
	});
	ev.preventDefault();
});



