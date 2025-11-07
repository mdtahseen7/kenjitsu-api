
#  Kenjitsu API

A lightweight, high-performance Node.js API built with **Fastify** for delivering detailed metadata and streaming sources for anime, movies, and TV shows.


## 🚀 Features

* ⚡ **Fast and efficient** — built on Fastify for optimal performance
* 🎬 **Comprehensive endpoints** for anime, movies, and TV series
* 🌐 **JSON-based responses** — ready for integration with web and mobile apps
* 🐳 **Self-hostable** — easily run using Docker


## 📦 Self-Hosting with Docker


### **1. Pull the Docker image**

```bash
docker pull ghcr.io/middlegear/kenjitsu-api:latest
```

### **2. Run the container**

```bash
docker run  -p 3000:3000 ghcr.io/middlegear/kenjitsu-api:latest
```

### **3. (Optional) Set environment variables**

You can define additional variables in a `.env` file and use:

```bash
docker run --env-file .env -p 3000:3000 ghcr.io/middlegear/kenjitsu-api:latest
```

---

## Documentation

Full API reference and usage examples are available at
 [**kenjitsu-docs.vercel.app**](https://kenjitsu-docs.vercel.app)



## ⚠️ Disclaimer

> This project is for **educational purposes only**.
> Kenjitsu API is an **unofficial** service and is **not affiliated** with any third-party providers.
> The API does **not host, store, or distribute** any media content — all data belongs to its respective owners.
