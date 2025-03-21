
<p align="center">
  <img src="https://m3jz13d05b.ufs.sh/f/dLgmbGNJLXerMjDNawBovlI3sdb2nkrUQc6OBfxYZGS19XE7" alt="Beerus the Destroyer" width="450">
</p>

<h1 align="center">Hakai API</h1>  
<p align = "center">A RESTful api serving anime metadata.</p>

> **Disclaimer:**  
> This package is **unofficial** and is **not affiliated** with Anilist, Jikan, or any third-party providers. It does not host, own, or distribute any content. All data belongs to its respective owners.  

## **Features**  
✅ **Search Anime** by title  
📄 **Get Anime Metadata** including episodes and details  
📺 **Fetch Streaming Servers**  
🎥 **Get Watch Links** for anime episodes  
⚡ **Caching with Redis & Memory** for performance  
🛡️ **Rate Limiting** to prevent abuse  

---

## **Installation**  

### **Install Node.js**  
Before using Hakai API, ensure you have **Node.js** installed. You can download it from:  
➡ [Node.js Official Website](https://nodejs.org/)

To verify installation:  
```sh
node -v
```

This should output the installed Node.js version.

### **Clone the Repository**  
```sh
git clone https://github.com/middlegear/hakai-api.git
cd hakai-api
```

### **Install Dependencies**  
```sh
pnpm install
```

### **Set Up Environment Variables**  
Create a `.env` file in the root directory:

```
# ========================
# Server Configuration Optional
# ========================
PORT=3000
HOSTNAME=0.0.0.0

# ========================
# Rate Limiting
# ========================
MAX_API_REQUESTS=6
WINDOW_IN_MS=1000

# ========================
# Redis Configuration Optional
# ========================
REDIS_PORT=6379
REDIS_HOST=localhost
REDIS_PASSWORD=

# ========================
# In-Memory Caching Optional 
# ========================
MEMORY_CACHE_ENABLED=false
MEMORY_CACHE_TTL_MINUTES=30

# ========================
# CORS Configuration Optional
# ========================
ALLOWED_ORIGINS=*
```

### **Start the Server**  
```sh
pnpm run start
```
The API will run on **`http://localhost:3000`**.

---

## **Contributing**  
Pull requests are welcome! Feel free to fork and submit improvements.  

## ⚖ License  
This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.


