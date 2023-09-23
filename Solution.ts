/*Solution

SOLID Principles:

Single Responsibility Principle: 
La clase LibraryManager se ocupa únicamente de la lógica de la biblioteca,
mientras que el servicio EmailService se ocupa del envío de correos 
electrónicos.

Open/Closed Principle: 
Las clases están abiertas para extensión 
(por ejemplo, añadiendo más tipos de notificaciones) 
pero cerradas para modificación.

Liskov Substitution Principle: User implementa la interfaz IObserver, 
lo que significa que se puede sustituir por cualquier otro objeto que 
también implemente la interfaz.

Dependency Inversion Principle: 
Se inyecta IEmailService en LibraryManager, 
lo que significa que LibraryManager no depende de una implementación 
concreta.

Inyección de Dependencias:
Inyectar IEmailService en LibraryManager.

Lambda Expressions:
Usar expresiones lambda en funciones como find y forEach.

Singleton Pattern:
Garantizar que solo haya una instancia de LibraryManager con 
el método getInstance.

Observer Pattern:
Los usuarios (User) se registran como observadores y son notificados 
cuando se añade un nuevo libro.

Builder Pattern:
Se utiliza para construir instancias de Book de una manera más limpia 
y escalable.

Refactorización:
eliminar el uso de ANY mejorar el performance

Aspectos (Opcional)
Puedes anadir logs de info, warning y error en las llamadas, 
para un mejor control

Diseño por Contrato (Opcional):
Puedes anadir validaciones en precondiciones o postcondiciones 
como lo veas necesario*/


/*Solucion*/

interface InfEmailService {
    sendEmail(userID: string, message: string): void;
}

class EmailService implements InfEmailService {
    sendEmail(userID: string, message: string) {
        console.log(`Enviando email a ${userID}: ${message}`);
    }
}


/*Ejemplo de uso de EmailService
const emailService = new EmailService();
emailService.sendEmail("user123", "Hola, este es un email de prueba.");
*/

class Book {
    constructor(
        public title: string, 
        public author: string, 
        public ISBN: string) {}
}

class Loan {
    constructor(
        public ISBN: string, 
        public userID: string, 
        public date: Date) {}
}

class LibraryManager {
    private static instance: LibraryManager;
    private books: Book[] = [];
    private loans: Loan[] = [];
    private emailService: InfEmailService;

    private constructor(emailService: InfEmailService) {
        this.emailService = emailService;
    }

    public static getInstance(emailService: InfEmailService): LibraryManager {
        if (!LibraryManager.instance) {
            LibraryManager.instance = new LibraryManager(emailService);
        }
        return LibraryManager.instance;
    }

    addBook(title: string, author: string, ISBN: string) {
        this.books.push(new Book(title, author, ISBN));
        this.addBookForUser
    }

    addBookForUser(title: string, userID: string) {
        this.notifyUsersNewBook(title, userID);
    }
    
    removeBook(ISBN: string) {
        const index = this.books.findIndex(book => book.ISBN === ISBN);
        if (index !== -1) {
            this.books.splice(index, 1);
        }
    }

    searchByTitle(title: string): Book[] {
        return this.books.filter(book => book.title.includes(title));
    }

    searchByAuthor(author: string): Book[] {
        return this.books.filter(book => book.author.includes(author));
    }

    searchByISBN(ISBN: string): Book | undefined {
        return this.books.find(book => book.ISBN === ISBN);
    }

    loanBook(ISBN: string, userID: string) {
        const book = this.searchByISBN(ISBN);
        if (book) {
            this.loans.push(new Loan(ISBN, userID, new Date()));
            this.emailService.sendEmail(userID, `Has solicitado el libro ${book.title}`);
        }
    }

    returnBook(ISBN: string, userID: string) {
        const index = this.loans.findIndex(loan => loan.ISBN === ISBN && loan.userID === userID);
        if (index !== -1) {
            this.loans.splice(index, 1);
            this.emailService.sendEmail(userID, 
                `Has devuelto el libro con ISBN ${ISBN}. ¡Gracias!`);
        }
    }

    private notifyUsersNewBook(title: string, userID : string) {
        this.emailService.sendEmail(userID, `Nos llego el siguiente libro ${title} te interesa?`);
    }
}


//Uso del codigo

const emailService = new EmailService();
const libraryManager = LibraryManager.getInstance(emailService);

libraryManager.addBook("El Gran Gatsby", "F. Scott Fitzgerald", "123456789");
libraryManager.addBook("1984", "George Orwell", "987654321");

const booksByTitle: Book[] = libraryManager.searchByTitle("El Gran Gatsby");
const booksByAuthor: Book[] = libraryManager.searchByAuthor("George Orwell");
// const booksByISBN: Book[] = libraryManager.searchByISBN("Gatsby");

libraryManager.loanBook("9780743273565", "user123");

libraryManager.returnBook("9780743273565", "user123");