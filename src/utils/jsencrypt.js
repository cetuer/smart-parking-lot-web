import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDSjZh6nJ0Pi7VJc0zPUzs9ThkC0VHKDCvlBC7INPt/np12qe8ih/3awOxVtfEGN4IOdtmKSyATfEVLgwHtIG90tnY+1MrtCrrR5m//xodf8s25k7V2mDbbRXm1bSNXz45zI2WBBWrNTAEM31oEw8tEjLvYbc2g/d0dYbwhi31ZwIDAQAB'

const privateKey = 'MIICXQIBAAKBgQDDSjZh6nJ0Pi7VJc0zPUzs9ThkC0VHKDCvlBC7INPt/np12qe8ih/3awOxVtfEGN4IOdtmKSyATfEVLgwHtIG90tnY+1MrtCrrR5m//xodf8s25k7V2mDbbRXm1bSNXz45zI2WBBWrNTAEM31oEw8tEjLvYbc2g/d0dYbwhi31ZwIDAQABAoGAMvwvEoU4+Gw7od5KonQAn2SuIkBnB9rQSyam75P0gJANvLMnU6vkCJ5hymzXzBSJ8y/XveZF/gFbTaJF9cUEketxhINf/OEpYLyT2nZ4jXGPDqyBwADFfLqSumIOtDucNcWLO7Tnh/UOKcd2f6PQZSFEjpEDx1co3S1VlTaMu7ECQQDvhRDnwhRuZxRdkedGxee6Amn196rKz43ggowFi4Bo63kST+zOpxLzUvSwe3uh2cLe+mCB7SJR3esvVI6jYGwrAkEA0LoTM8mVaj0QMH4uNUbGg29xpax5VZFHzYTTyMC7LNaT0LLic4knhlPvrZ17ah27Fvoy7I/PvtRRIj8m2AfxtQJAJQiI/Zx3dj5/2pvVi47L7mmzInHBuYvv3teweKcCGrbVyGwNLEKO3opkBOmCyxqVU86Yn14f4VKTq4TCbSZacwJBAMetu0EH0BDaaep6S+pb0v1aV/aOkWTynyZVs+WRu36hqLc26rxssYsoMVp+FdrmplzM7nqw+aUtqJCCqb5xmyECQQDPrDKUS6yIcQXdmNHeTvEMzCd/VJ4AJWCdB+c+mGNugsK4XWJO/FlbjqYpViV2I2YJLFUGwLVaJ4fgW+h7y2be'

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

