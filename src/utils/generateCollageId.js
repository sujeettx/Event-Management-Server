import crypto from'crypto';
export const generatecollageId = (collegeName, collegeEmail) => {
  const data = `${collegeName}-${collegeEmail}`; 
  const hash = crypto.createHash('md5').update(data).digest('hex');
  return hash.substr(0, 7);
};
