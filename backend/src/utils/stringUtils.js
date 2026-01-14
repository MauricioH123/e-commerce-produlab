export function capitalizeWords(str){
    return str.trim()
    .toLowerCase()
    .split(/\s+/)  
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '); 
}