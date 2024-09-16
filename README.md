# [Pollinations.AI](https://pollinations.ai)

*Your Engine for Personalized Synthetic Media*

[![Pollinations.AI Logo](https://pollinations.ai/p/Pollinations.AI_logo_with_a_stylized_flower_and_bee,_simple_and_modern_design?width=300&height=100&nologo=true&seed=-1)](https://pollinations.ai/p/Pollinations.AI_logo_with_a_stylized_flower_and_bee,_simple_and_modern_design?width=300&height=100&nologo=true&seed=-1)

## Table of Contents
- [Pollinations.AI](#pollinationsai)
  - [Table of Contents](#table-of-contents)
  - [🌟 Introduction](#-introduction)
  - [🚀 Key Features](#-key-features)
  - [🚀 Getting Started](#-getting-started)
  - [🖥️ How to Use](#️-how-to-use)
    - [Web Interface](#web-interface)
    - [API](#api)
  - [🎨 Examples](#-examples)
    - [Image Generation](#image-generation)
    - [Text Generation](#text-generation)
  - [🛠️ Integration](#️-integration)
    - [React Components](#react-components)
  - [🌐 Projects Using Pollinations.AI](#-projects-using-pollinationsai)
    - [Social Bots](#social-bots)
    - [Mobile \& Web Applications](#mobile--web-applications)
    - [Chat Integrations](#chat-integrations)
    - [Development Tools](#development-tools)
  - [🔮 Future Developments](#-future-developments)
  - [🌍 Our Vision](#-our-vision)
  - [🏢 Supported By](#-supported-by)
  - [🤝 Community and Support](#-community-and-support)
  - [📜 License](#-license)

## 🌟 Introduction

[Pollinations.AI](https://pollinations.ai) is the most easy-to-use, free image generation API available. No signups or API keys required. Embed like any normal image.

## 🚀 Key Features

- 🔓 100% Open Source
- 🆓 Free to use
- 🔑 No signup or API keys
- 🖼️ Embed like any normal image
- 🌍 Over 50,000 active users and > 2 million images generated per month
- 🤝 Integrates with various open-source LLMs, bots, and communities

## 🚀 Getting Started

1. Visit [https://pollinations.ai](https://pollinations.ai)
2. Type your description in the text box
3. Click "Generate" and watch the magic happen!

For more advanced usage, check out our [API documentation](APIDOCS.md).

## 🖥️ How to Use

### Web Interface

Our web interface is user-friendly and doesn't require any technical knowledge. Simply visit [https://pollinations.ai](https://pollinations.ai) and start creating!

### API

Use our API directly in your browser or applications:

    https://pollinations.ai/p/conceptual_isometric_world_of_pollinations_ai_surreal_hyperrealistic_digital_garden

Replace the description with your own, and you'll get a unique image based on your words!

## 🎨 Examples

### Image Generation

Here's an example of a generated image:

[![Conceptual Isometric World](https://pollinations.ai/p/3d_wireframe_blueprint_for_the_prompt_conceptual%20isometric%20world%20of%20pollinations%20ai%20surreal%20hyperrealistic%20digital%20garden?width=512&height=512&nologo=true&seed=-1)](https://pollinations.ai/p/3d_wireframe_blueprint_for_the_prompt_conceptual%20isometric%20world%20of%20pollinations%20ai%20surreal%20hyperrealistic%20digital%20garden?width=512&height=512&nologo=true&seed=-1)

Python code to download the generated image:

    import requests

    def download_image(prompt):
        url = f"https://pollinations.ai/p/{prompt}"
        response = requests.get(url)
        with open('generated_image.jpg', 'wb') as file:
            file.write(response.content)
        print('Image downloaded!')

    download_image("conceptual_isometric_world_of_pollinations_ai_surreal_hyperrealistic_digital_garden")

### Text Generation

To generate text, use this URL:

    https://text.pollinations.ai/What%20is%20artificial%20intelligence?

## 🛠️ Integration

### React Components

We offer React components for easy integration. Example usage:

    import React from 'react';
    import { PollinationsImage, PollinationsMarkdown } from '@pollinations/react';

    const AIGeneratedContent = () => (
      <div>
        <h2>AI-Generated Travel Guide</h2>
        <PollinationsImage 
          prompt="Beautiful landscape of Paris with Eiffel Tower" 
          width={800} 
          height={600} 
          seed={42} 
        />
        <PollinationsMarkdown seed={42}>
          Write a brief travel guide for Paris, including top attractions and local cuisine
        </PollinationsMarkdown>
      </div>
    );

    export default AIGeneratedContent;

Check out our [Pollinations React Components](./pollinations-react/README.md) for more details.

## 🌐 Projects Using Pollinations.AI

Pollinations.AI is used in various projects, including:

### Social Bots
1. [Discord Bot](https://discord.gg/D9xGg8mq3D): A Discord bot that uses Pollinations.ai for generating images based on user prompts. Created by @Zngzy. [GitHub Repo](https://github.com/Zingzy/pollinations.ai-bot)
2. [WhatsApp Group](https://chat.whatsapp.com/KI37JqT5aYdL9WBYMyyjDV): A WhatsApp group that allows you to generate images using Pollinations.ai. Created by @dg_karma.
3. [Telegram Bot](http://t.me/pollinationsbot): A Telegram bot for generating images. Created by Wong Wei Hao.
4. [Anyai](https://discord.com): A Discord bot and community that leverages Pollinations.ai for generating AI-driven content. Created by @meow_18838.
5. [OpenHive](https://discord.gg/Zv3SXTF5xy): A Discord server that bridges the gap between Discord and AI. With Beebot, access dozens of ChatGPT prompts and generate images using various AI tools, including Pollinations.ai! Created by @creativegpt.

### Mobile & Web Applications
6. [Pollinator Android App](https://github.com/g-aggarwal/Pollinator): An open-source Android app for text-to-image generation using Pollinations.ai's endpoint. Created by @gaurav_87680.
7. [Own-AI](https://own-ai.pages.dev/): An AI text-to-image generator powered by Pollinations.ai. Users can describe the images they want, generate them, and share them with the community. Created by Sujal Goswami. [GitHub Repo](https://github.com/sujal-goswami/Own-AI)
8. [POLLIPAPER](https://github.com/Tolerable/POLLIPAPER): A dynamic wallpaper application that uses Pollinations AI to create and set unique desktop backgrounds. It offers features like weather-based prompts and customizable settings. Created by @intolerant0ne. [GitHub Repo](https://github.com/Tolerable/)
9. [StorySight](https://github.com/abiral-manandhar/storySight): An app helping children with learning disabilities visualize abstract concepts. Made using Django and Pollinations.ai.
10. [Websim](https://websim.ai/c/bXsmNE96e3op5rtUS): A web simulation tool integrating Pollinations.ai. Created by @thomash_pollinations.

### Chat Integrations
11. [SillyTavern](https://docs.sillytavern.app/extensions/stable-diffusion/): An LLM frontend for power users. Pollinations permits it to generate images. [GitHub Repo](https://github.com/SillyTavern/SillyTavern)
12. [FlowGPT](https://flowgpt.com/p/instant-image-generation-with-chatgpt-and-pollinationsai): Generate images on-demand with ChatGPT and Pollinations.AI.
13. [DynaSpark AI](https://dynaspark.onrender.com): An versatile AI assistant with advanced image and text generation capabilities, integrating Pollinations.ai for image generation. Created by [Th3-C0der](https://github.com/Th3-C0der).

### Development Tools
14. [Python Package](https://pypi.org/project/pollinations/): A Python package for easy integration of Pollinations.ai.
15. [Toolkitr](https://github.com/toolkitr/pollinations.ai): Another Python wrapper for Pollinations.

Have you created a project using Pollinations.AI? Email us at hello@pollinations.ai to get it listed here!

## 🔮 Future Developments

We're constantly exploring new ways to push the boundaries of AI-driven content creation. Some areas we're excited about include:

- Digital Twins: Creating interactive AI-driven avatars
- Music Video Generation: Combining AI-generated visuals with music for unique video experiences
- Real-time AI-driven Visual Experiences: Projects like our Dreamachine, which create immersive, personalized visual journeys

## 🌍 Our Vision

Pollinations.AI aims to bridge technological innovation with global creativity. Our international team combines precision engineering with artistic flair to create a platform that serves creators worldwide.

## 🏢 Supported By

Pollinations.AI is proud to be supported by:

[![Supported Companies](https://pollinations.ai/p/Logos_of_AWS_Activate,_Google_Cloud_for_Startups,_OVH_Cloud,_NVIDIA_Inception,_Azure,_and_Outlier_Ventures_arranged_in_a_grid?width=300&height=200&nologo=true&seed=-1)](https://pollinations.ai/p/Logos_of_AWS_Activate,_Google_Cloud_for_Startups,_OVH_Cloud,_NVIDIA_Inception,_Azure,_and_Outlier_Ventures_arranged_in_a_grid?width=300&height=200&nologo=true&seed=-1)

- [AWS Activate](https://aws.amazon.com/activate/)
- [Google Cloud for Startups](https://cloud.google.com/startup)
- [OVH Cloud](https://www.ovhcloud.com/en/startup/)
- [NVIDIA Inception](https://www.nvidia.com/en-us/startups/)
- [Azure (MS for Startups)](https://startups.microsoft.com/)
- [Outlier Ventures](https://outlierventures.io/)

## 🤝 Community and Support

Join our vibrant community of over 12,000 Discord members to share your creations, get support, and collaborate with fellow AI enthusiasts. 

For any questions or support, please visit our [Discord channel](https://discord.gg/k9F7SyTgqn) or create an issue on our [GitHub repository](https://github.com/pollinations/pollinations).

## 📜 License

Pollinations.AI is open-source software licensed under the [MIT license](LICENSE).

---

Made with ❤️ by the Pollinations.AI team