import React from 'react'

interface ChatProps {
    Reciver: {
        id: string;
        username: string;
        profilePhoto?: string;
    };
}

const chat : React.FC<ChatProps> = ({ Reciver }: ChatProps) => {
    return (
        <div>{Reciver.username}</div>
    )
}

export default chat