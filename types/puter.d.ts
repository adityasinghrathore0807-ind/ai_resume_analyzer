//this file will contain all the puter types
//It will contain all the items and AI Responses to it
//we need it to call the API simply by saying {window.puter.(Functions)}


// This function represents a file or directory in virtual file system
interface FSItem {
    id: string;//unique identifier for this item
    uid: string;//Unique user identifies on who owns item
    name: string;//Name the file or directory
    path: string;//Full path to the item
    id_dir: boollean;//true if item is a directory
    parent_id: string;// ID off parent 0directly
    parent_uid: string;// UID of the Owner of the parent directory
    created: number;//Timestamp of the created
    modified: number;//Timestamp of the last modification
    accessed: number;//Timestamp of last access
    size: number | null;//size is in byter and it is null if unknown
    writable: boolean;// return true if the user can write to this item
}
//Represent a user of the system
interface PuterUser{
    uuid: string;//unique identifier for the user
    username: string;//Username of the user
}
//Respresent a simple key-value pair
interface KVItem{
    key: string;//the key
    value:string//the value
}
// Represet thr content of a chat message
interface ChatMessage{
    roles: 'user' | 'assistant' | 'system';//who sent the message
    content: string | ChatMessageContent[];//message content aws a string or array of structure content
}
//Represent a chat message content in a conversation
interface ChatMessageContent{
    type: 'file' | 'text';//type of content:either filr reference or text
    puter_path?: string;//Path of the file if the type is 'file'
    text?: string;//text content if the type id 'text'
}

//Options to confique an AI chat session
interface PuterChatOptions{
    model?: string;//Optional:specify AI model to use
    stream?: boolean;//optional:stream responses instead of full completion
    max_token?: number;//Optional:max token in a response
    temperature?: number;//Optional : randomness/creativity of the response from AI
    tools?: {
        types: 'function'//Always'function' for callable tools
        functions: {
            name: string;//Name of the tool/function
            description: string;//description of what it does
            parameters: { type: string; properties:{}}//parameters schema for the function

            }
        }
}
//Resresent the response from AI chat service
interface AIResponse{
    index: number;//index of the response in batch
    message: {
        role: string;//role of the sender(assistant,system,user)
        content: string | any[];//Response content - could be unstructured or text
        refusal: null | string;//If the AI refused to respond,it should display a reason for refusal
        annotations: any[];//Optional annotation or metadata
    };
    logprobs: null | any;//optional : Log probabilities for generated tokens
    finish_reason: string;//reasons why the AI generation stopped ('length','stop',etc.)
    usage: {
        type: string;//Type of usage
        model: string;//model used
        amount: number;//Number of tokens consumed
        cost: number;//cost of the usage
    }[];
    via_ai_chat_service: boolean;//true if response came from AI chat service0
    }
