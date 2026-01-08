interface User {
    id: string;
    username: string;
    profilePhoto?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
declare global { 
    namespace SocketIO {
        interface Socket {
            user?: User;
        }
}
}

export {User};