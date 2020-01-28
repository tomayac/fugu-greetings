import {contactsButton, ctx, canvas} from './script.mjs';

const getContacts = async () => {
  const properties = ['name'];
  const options = {multiple: true};
  try {
    return await navigator.contacts.select(properties, options);
  } catch (err) {
    console.error(err.name, err.message);
  }
};

contactsButton.style.display = 'block';
contactsButton.addEventListener('click', async () => {
  const contacts = await getContacts();
  if (contacts) {
    ctx.font = '1em Comic Sans MS';
    contacts.forEach((contact, index) => {
      ctx.fillText(contact.name.join(), 20, 16 * ++index, canvas.width);
    });
  }
});

