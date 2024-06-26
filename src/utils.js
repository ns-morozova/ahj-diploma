export function convertLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}

export function base64ToBlob(base64Data, type) {
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    let typeMedia = '';
    if (type == 'video') {
        typeMedia = 'video/mp4';        
    } else if (type == 'audio') {
        typeMedia = 'audio'; 
    }
    //const blob = new Blob(byteArrays, { type: 'video/mp4' });
    const blob = new Blob(byteArrays, { type: typeMedia });
    return blob;
}