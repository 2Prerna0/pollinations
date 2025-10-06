# 🍕 Food Calorie Annotator

**An AI-powered web app that automatically annotates food images with estimated calorie values!**

Built for Hacktoberfest 2025 using [Pollinations.AI](https://pollinations.ai) 🐝

---

## 🚀 Features

✅ **Smart Image Upload** - Drag & drop or click to upload food images (JPG, PNG)

✅ **AI-Powered Analysis** - Uses Pollinations Image API to generate calorie annotations

✅ **Interactive Comparison** - Before/After slider view to see the difference

✅ **Side-by-Side Display** - Compare original and annotated images

✅ **Nutrition Breakdown** - Shows estimated calories, protein, carbs, and fats

✅ **Download Results** - Save the annotated image to your device

✅ **Responsive Design** - Works beautifully on desktop, tablet, and mobile

---

## 🎯 How It Works

1. **Upload** - Select or drag a food image into the upload zone
2. **Analyze** - Click "Analyze Calories" to send the image to Pollinations AI
3. **Compare** - Use the interactive slider to compare before and after
4. **Download** - Save your annotated image with calorie labels

---

## 🛠️ Tech Stack

- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **React Compare Slider** - Interactive before/after comparison
- **Pollinations.AI API** - AI-powered image generation
- **Pure CSS** - Custom styling with gradients and animations

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Steps

1. **Clone the repository**
   ```bash
   cd hacktoberfest-2025/food-calorie-annotator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   Navigate to http://localhost:5173
   ```

---

## 🏗️ Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

The production-ready files will be in the `dist/` folder.

---

## 🔧 How It Uses Pollinations API

The app uses the **Pollinations Image API** with **image-to-image generation**:

### Step 1: Upload to Cloudinary
```javascript
// Upload user's food image to Cloudinary for public URL
const uploadedImageUrl = await uploadToCloudinary(selectedImage);
```

### Step 2: Generate Annotated Image
```javascript
const prompt = encodeURIComponent(
  `Analyze this food image and add professional calorie annotations. 
  Add clear labels with arrows pointing to each food item showing "Item Name - XXX kcal".
  Include portion sizes and total meal calories at the bottom.
  Use a modern nutrition label aesthetic with semi-transparent boxes and clear typography.`
);

const apiUrl = `https://image.pollinations.ai/prompt/${prompt}?image=${encodeURIComponent(uploadedImageUrl)}&width=1024&height=1024&model=nanobanana&enhance=true&nologo=true&referrer=foodcalloryannotator`;
```

**Parameters used:**
- `image`: URL of the uploaded food image (from Cloudinary)
- `width` & `height`: 1024x1024 for high-quality output
- `model=nanobanana`: Gemini 2.5 Flash Image model for image-to-image generation
- `enhance=true`: Improves prompt quality for better results
- `nologo=true`: Clean output without watermark
- `referrer=foodcalloryannotator`: App tracking for analytics

---

## 📸 Screenshots

### Main Interface
![Upload Screen](docs/screenshot-upload.png)

### Comparison View
![Comparison Slider](docs/screenshot-comparison.png)

### Results
![Nutrition Breakdown](docs/screenshot-results.png)

---

## 🎨 Features Implemented

### Core Requirements
- ✅ Image upload with drag & drop
- ✅ Pollinations API integration
- ✅ Before/After comparison display
- ✅ Frontend-only (no backend)
- ✅ Download annotated image

### Bonus Features
- ✅ Macro breakdown (Protein, Carbs, Fats)
- ✅ Interactive slider view
- ✅ Download functionality
- ✅ Responsive mobile design
- ✅ Professional UI/UX

---

## 🧩 Project Structure

```
food-calorie-annotator/
├── src/
│   ├── App.jsx          # Main React component
│   ├── App.css          # Styles and animations
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

---

## 🤝 Contributing

This project is part of **Hacktoberfest 2025**! Contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Future Enhancements

- [ ] Add support for multiple images
- [ ] Implement actual image-to-image API integration with kontext model
- [ ] Add meal history tracking
- [ ] Export nutrition data as PDF
- [ ] Support for different dietary preferences
- [ ] Multi-language support
- [ ] Dark mode toggle

---

## 🙏 Acknowledgments

- **Pollinations.AI** - For providing free AI image generation API
- **React Team** - For the amazing framework
- **React Compare Slider** - For the comparison component
- **Hacktoberfest** - For encouraging open source contributions

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🐝 About Pollinations.AI

[Pollinations.AI](https://pollinations.ai) is the world's most accessible open GenAI platform with direct text, image & audio API integration - no signup required!

**Learn more:**
- 📘 [API Documentation](https://github.com/pollinations/pollinations/blob/main/APIDOCS.md)
- 🌐 [Website](https://pollinations.ai)
- 💬 [Discord Community](https://discord.gg/pollinations)

---

**Made with ❤️ for Hacktoberfest 2025** 🎃
