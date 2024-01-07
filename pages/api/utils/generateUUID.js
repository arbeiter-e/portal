import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function generateUUID() {
  return uuidv4();
}

export async function generateTownUUID() {
  try {
    const response = await axios.get('/api/server/utils/generateUUID');

    if (response.status === 200) {
      return response.data.uuid;
    } else {
      alert('An error occurred while loading this view.');
      return null; // Return null or handle the error as needed
    }
  } catch (error) {
    console.error('Error generating town UUID:', error);
    alert('An error occurred while loading this view.');
    return null; // Return null or handle the error as needed
  }
}
