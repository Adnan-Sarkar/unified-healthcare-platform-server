import { v4 as uuidv4 } from "uuid";

// Example usage in a service or utility function
const generateUniqueId = () => {
  return uuidv4();
};

export default generateUniqueId;
