import { create } from 'zustand'

const useChatStore = create((set) => ({
  messages: [] as string[],
  messageRcever:  Object,
  setMessageRcever: (id: string) => {

    fetch(import.meta.env.VITE_BackendURI + `/api/utility/get-user-with-id?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        set({ messageRcever: data })
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
      })

  },
  addMessage: (message: string) =>
    set((state:any) => ({ messages: [...state.messages, message] })),
}))

export default useChatStore
