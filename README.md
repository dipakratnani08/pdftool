# PDFCore - PDF Utility Hub

A modern PDF utility web application that provides comprehensive PDF manipulation capabilities without using paid third-party tools. The application features a clean, mobile-friendly UI built with React, TypeScript, and Tailwind CSS.

## Features

- **PDF Merging**: Combine multiple PDFs into a single document
- **PDF Splitting**: Separate PDFs into individual files
- **PDF Compression**: Optimize PDF file size
- **PDF Format Conversion**: Convert to/from PDF (Word, Excel, HTML, JPG)
- **PDF Editing**: Edit text, add images, and annotate PDFs
- **PDF Security**: Add or remove password protection

## Technology Stack

- **Frontend**: React (with TypeScript), Tailwind CSS, Shadcn UI components
- **Backend**: Node.js, Express
- **File Handling**: pdf-lib, multer
- **Routing**: wouter
- **State Management**: TanStack Query (React Query)
- **Form Handling**: react-hook-form with zod validation

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/pdfcore.git
cd pdfcore
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:5000](http://localhost:5000)

## Project Structure

```
├── client                  # Frontend React application
│   ├── src
│   │   ├── components      # Reusable UI components
│   │   ├── hooks           # Custom React hooks
│   │   ├── lib             # Utility functions and API clients
│   │   ├── pages           # Page components
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
├── server                  # Backend Express server
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage layer
│   └── vite.ts             # Vite server configuration
├── shared                  # Shared code between frontend and backend
│   └── schema.ts           # Data models and validation schemas
└── package.json            # Project dependencies and scripts
```

## Using the Application

1. **Home Page**: Browse all available PDF tools
2. **PDF Tools**: Use the navigation menu to access different PDF manipulation tools
3. **Upload Files**: Drag and drop files or use the file browser to upload PDFs
4. **Process Files**: Apply various operations to your PDFs
5. **Download Results**: Download the processed files directly to your device

## Development

### Running in Development Mode

```bash
npm run dev
```

This starts both the backend server and frontend development server concurrently.

### Building for Production

```bash
npm run build
```

### Running in Production Mode

```bash
npm start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [pdf-lib](https://github.com/Hopding/pdf-lib) for PDF manipulation
- [Shadcn UI](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Contact

If you have any questions or feedback, please feel free to contact us.