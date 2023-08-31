import "./App.css";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  push,
  update,
  remove,
} from "firebase/database";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAsi0xJVkhHOzzOG7VOiXMZ9lKllU7i90k",
  authDomain: "site-cocrie.firebaseapp.com",
  databaseURL: "https://site-cocrie-default-rtdb.firebaseio.com",
  projectId: "site-cocrie",
  storageBucket: "site-cocrie.appspot.com",
  messagingSenderId: "529313990600",
  appId: "1:529313990600:web:40542fe211ea4c0d0b22fd",
  measurementId: "G-CGQY5SNXJ5",
};

// Inicializa o Firebase
initializeApp(firebaseConfig);

function Home({ onLogout }) {
  const handleLogout = () => {
    // Aqui você pode adicionar a lógica para lidar com o logout do usuário
    onLogout();
    window.alert("Usuário deslogado com sucesso!");
  };
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    field: "",
    referredBy: "",
    contactDate: "",
  });
  const [editContactId, setEditContactId] = useState(null);

  // Carrega os contatos do banco de dados quando o componente é montado
  useEffect(() => {
    const db = getDatabase();
    const contactsRef = ref(db, "contacts");
    onValue(contactsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setContacts(
          Object.entries(data).map(([id, contact]) => ({ ...contact, id }))
        );
      }
    });
  }, []);

  const handleNewContact = (event) => {
    event.preventDefault();
    if (!newContact.contactDate) {
      window.alert("Por favor, selecione uma data!");
      return;
    }
    if (new Date(newContact.contactDate) < new Date()) {
      window.alert("A data selecionada não pode ser anterior à data atual!");
      return;
    }
    if (editContactId) {
      const db = getDatabase();
      const contactRef = ref(db, `contacts/${editContactId}`);
      update(contactRef, {
        ...newContact,
        updatedAt: new Date().toISOString(),
      });
      setEditContactId(null);
    } else {
      const db = getDatabase();
      const contactsRef = ref(db, "contacts");
      push(contactsRef, newContact);
    }
    setNewContact({
      name: "",
      phone: "",
      email: "",
      field: "",
      referredBy: "",
      contactDate: "",
    });
  };

  const handleEditContact = (contact) => {
    setNewContact(contact);
    setEditContactId(contact.id);
  };

  const handleDeleteContact = (id) => {
    const db = getDatabase();
    const contactRef = ref(db, `contacts/${id}`);
    remove(contactRef).then(() => {
      window.location.reload();
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewContact((prevContact) => ({ ...prevContact, [name]: value }));
  };

  return (
    <div>
      <h1>Bem-vindo à agenda Cocrie!</h1>
      <button className="btn-logout" onClick={handleLogout}>
        <span className="texto-sair">Sair</span>
      </button>
      <div className="container">
        <div className="esquerda">
          <h2>Contatos</h2>
          <div className="lista-de-contatos">
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <p>Nome: {contact.name}</p>
                  <p>Telefone: {contact.phone}</p>
                  <p>Email: {contact.email}</p>
                  <p>Área de atuação / Ramo: {contact.field}</p>
                  <p>Indicado por: {contact.referredBy}</p>
                  <p>
                    Realizar contato em:{" "}
                    {contact.contactDate &&
                      format(parseISO(contact.contactDate), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                  </p>
                  <p>
                    Data de atualização:{" "}
                    {contact.updatedAt &&
                      format(
                        parseISO(contact.updatedAt),
                        "dd/MM/yyyy - HH:mm",
                        {
                          locale: ptBR,
                        }
                      )}
                  </p>
                  <button onClick={() => handleEditContact(contact)}>
                    Editar
                  </button>
                  <button onClick={() => handleDeleteContact(contact.id)}>
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="direita">
          <h2>{editContactId ? "Editar Contato" : "Novo Contato"}</h2>
          <div className="formulario-contato">
            <form onSubmit={handleNewContact}>
              <label>
                Nome:
                <input
                  type="text"
                  name="name"
                  value={newContact.name}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <label>
                Telefone:
                <input
                  type="text"
                  name="phone"
                  value={newContact.phone}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={newContact.email}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <label>
                Área de atuação / Ramo:
                <input
                  type="text"
                  name="field"
                  value={newContact.field}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <label>
                Indicado por:
                <input
                  type="text"
                  name="referredBy"
                  value={newContact.referredBy}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <label>
                Realizar contato em:
                <input
                  type="date"
                  name="contactDate"
                  value={newContact.contactDate}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <input
                className="btn-criar"
                type="submit"
                value={editContactId ? "Salvar Alterações" : "Criar Contato"}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
