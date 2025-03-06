import crypto from'crypto';
const generatecollegeId = (collegeName, collegeEmail) => {
  const data = `${collegeName}-${collegeEmail}`; 
  const hash = crypto.createHash('md5').update(data).digest('hex');
  return hash.substr(0, 7);
};

export default generatecollegeId;