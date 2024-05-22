import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PptxGenJS from 'pptxgenjs';
import Modal from 'react-modal';
import './CreatePPT.css';

Modal.setAppElement('#root');  

function CreatePPT() {
  const location = useLocation();
  const { formData, textAreas } = location.state;
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  };

  const generatePreviewContent1 = () => {
    return (
      <div className="slide-preview">
        <h3>{formData.title}</h3>
        <p>Duration: {formatDate(formData.durationStart)} - {formatDate(formData.durationEnd)}</p>
        <p>Name: {formData.name}</p>
        <p>Technology: {formData.technology}</p>
        <p>Summary: {formData.summary}</p>
      </div>
    );
  };

  const generatePreviewContent2 = () => {
    return (
      <div className="slide-preview" style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ color: '#ff5733' }}>{formData.title}</h3>
        <p><strong>Duration:</strong> {formatDate(formData.durationStart)} - {formatDate(formData.durationEnd)}</p>
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Technology:</strong> {formData.technology}</p>
        <p><strong>Summary:</strong> {formData.summary}</p>
      </div>
    );
  };

  const generatePPTLayout1 = () => {
    const pptx = new PptxGenJS();
    let slide = pptx.addSlide();
    slide.background = { color: 'f1f1f1' };
    slide.addText(formData.title, { x: 1, y: 1, fontSize: 24, bold: true, color: '007bff' });
    slide.addText(`Duration: ${formatDate(formData.durationStart)} - ${formatDate(formData.durationEnd)}`, { x: 1, y: 2, fontSize: 18 });
    slide.addText(`Name: ${formData.name}`, { x: 1, y: 3, fontSize: 18 });
    slide.addText(`Technology: ${formData.technology}`, { x: 1, y: 4, fontSize: 18 });
    slide.addText(`Summary: ${formData.summary}`, { x: 1, y: 5, fontSize: 18 });

    textAreas.forEach((group) => {
      group.areas.forEach((area) => {
        let slide = pptx.addSlide();
        slide.background = { color: 'ffffff' };
        if (area.type === 'text') {
          slide.addText(area.label, { x: 1, y: 0.5, fontSize: 20, bold: true });
          slide.addText(area.text, { x: 1, y: 1.5, fontSize: 18 });
        } else if (area.type === 'code') {
          slide.addText(area.label, { x: 1, y: 0.5, fontSize: 20, bold: true });
          slide.addText(area.text, { x: 1, y: 1.5, fontSize: 18, fontFace: 'Courier New' });
        } else if (area.type === 'image' && area.preview) {
          slide.addImage({ data: area.preview, x: 1, y: 1, w: 6, h: 4 });
        }
      });
    });

    return pptx;
  };

  const generatePPTLayout2 = () => {
    const pptx = new PptxGenJS();
    let slide = pptx.addSlide();
    slide.background = { color: 'e1e1e1' };
    slide.addText(formData.title, { x: 0.5, y: 0.5, fontSize: 30, bold: true, color: 'ff5733' });
    slide.addText(`Duration: ${formatDate(formData.durationStart)} - ${formatDate(formData.durationEnd)}`, { x: 0.5, y: 1.5, fontSize: 18 });
    slide.addText(`Name: ${formData.name}`, { x: 0.5, y: 2.5, fontSize: 18 });
    slide.addText(`Technology: ${formData.technology}`, { x: 0.5, y: 3.5, fontSize: 18 });
    slide.addText(`Summary: ${formData.summary}`, { x: 0.5, y: 4.5, fontSize: 18 });

    textAreas.forEach((group) => {
      group.areas.forEach((area) => {
        let slide = pptx.addSlide();
        slide.background = { color: 'f5f5f5' };
        if (area.type === 'text') {
          slide.addText(area.label, { x: 0.5, y: 0.5, fontSize: 20, bold: true });
          slide.addText(area.text, { x: 0.5, y: 1.5, fontSize: 18 });
        } else if (area.type === 'code') {
          slide.addText(area.label, { x: 0.5, y: 0.5, fontSize: 20, bold: true });
          slide.addText(area.text, { x: 0.5, y: 1.5, fontSize: 18, fontFace: 'Courier New' });
        } else if (area.type === 'image' && area.preview) {
          slide.addImage({ data: area.preview, x: 0.5, y: 1, w: 6, h: 4 });
        }
      });
    });

    return pptx;
  };

  const layouts = [
    { id: 1, name: 'Layout 1', generate: generatePPTLayout1, preview: generatePreviewContent1() },
    { id: 2, name: 'Layout 2', generate: generatePPTLayout2, preview: generatePreviewContent2() },
    //  다른 레이아웃 추가
  ];

  const handleOpenModal = (layout) => {
    setSelectedLayout(layout);
    setPreviewContent(layout.preview);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDownload = () => {
    if (selectedLayout) {
      const pptx = selectedLayout.generate();
      pptx.writeFile({ fileName: `${formData.title}.pptx` });
    }
  };

  return (
    <div>
      <h1>Select a PPT Layout</h1>
      <div className="ppt-layouts">
        {layouts.map(layout => (
          <div
            key={layout.id}
            className="ppt-layout"
            onClick={() => handleOpenModal(layout)}
          >
            {layout.name}
          </div>
        ))}
      </div>
      {selectedLayout && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel="PPT Layout Preview"
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Preview: {selectedLayout.name}</h2>
          {previewContent}
          <button onClick={handleDownload}>Download Selected Layout</button>
          <button onClick={handleCloseModal}>Close</button>
        </Modal>
      )}
    </div>
  );
}

export default CreatePPT;







// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import PptxGenJS from 'pptxgenjs';
// import axios from 'axios';
// import './CreatePPT.css';

// function CreatePPT() {
//   const location = useLocation();
//   const { formData, textAreas } = location.state;
//   const [pptLayouts, setPptLayouts] = useState([]);
//   const [selectedLayout, setSelectedLayout] = useState(null);

//   useEffect(() => {
//     const generatePptLayouts = async () => {
//       try {
//         const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
//           prompt: createPrompt(formData, textAreas),
//           max_tokens: 1000,
//           n: 6,
//         }, {
//           headers: {
//             'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
//           },
//         });

//         setPptLayouts(response.data.choices);
//       } catch (error) {
//         console.error('Error generating PPT layouts:', error);
//       }
//     };

//     generatePptLayouts();
//   }, [formData, textAreas]);

//   const createPrompt = (formData, textAreas) => {
//     return `Generate 6 different PPT layouts based on the following data:
//     Title: ${formData.title}
//     Duration: ${formData.durationStart} - ${formData.durationEnd}
//     Name: ${formData.name}
//     Technology: ${formData.technology}
//     Summary: ${formData.summary}
//     Text Areas: ${JSON.stringify(textAreas)}
//     Each layout should include a cover slide, a slide for the summary, and separate slides for each text area.`;
//   };

//   const handleDownload = () => {
//     const pptx = new PptxGenJS();

//     const selectedData = pptLayouts[selectedLayout];

//     selectedData.slides.forEach(slide => {
//       const pptSlide = pptx.addSlide();
//       slide.elements.forEach(element => {
//         if (element.type === 'text') {
//           pptSlide.addText(element.content, { x: element.x, y: element.y, fontSize: element.fontSize });
//         } else if (element.type === 'image') {
//           pptSlide.addImage({ data: element.content, x: element.x, y: element.y, w: element.w, h: element.h });
//         }
//       });
//     });

//     pptx.writeFile({ fileName: `${formData.title}.pptx` });
//   };

//   return (
//     <div>
//       <h1>PPT 선택</h1>
//       <div className="ppt-layouts">
//         {pptLayouts.map((layout, index) => (
//           <div key={index} className="ppt-layout" onClick={() => setSelectedLayout(index)}>
//             
//             {layout.preview}
//           </div>
//         ))}
//       </div>
//       {selectedLayout !== null && (
//         <button onClick={handleDownload}>Download Selected Layout</button>
//       )}
//     </div>
//   );
// }

// export default CreatePPT;







