import { useState } from 'react';
import Modal from 'react-modal';
import Button from './Button';
import PixGeneratorFixedEmail from './GiftTest';
import { siteConfig } from '../utils/config';

// estilo básico do modal (pode ajustar)
const customStyles = {
  content: {
    maxWidth: '600px',
    margin: 'auto',
    borderRadius: '16px',
    padding: '20px',
    backgroundColor: 'white',
    border: '1px solid #d1fae5',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
};

// importante para acessibilidade (raiz da sua app)
Modal.setAppElement('#root');

const GiftCard = ({ gift }) => {
  const [open, setOpen] = useState(false);

  const openPixModal = () => setOpen(true);
  const closePixModal = () => setOpen(false);

  return (
    <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <img src={gift.image} alt={gift.title} className="w-full h-40 object-contain" />
      <div className="p-2 flex-1 flex flex-col text-center">
        <h4 className="font-semibold text-emerald-900 ">
          {gift.title}  
        </h4>
        <p className="text-slate-600 text-sm m-1 flex-1  text-base">{gift.description}</p>
        <p className='font-semibold '>R${gift.price.toFixed(2).replace(".",",")}</p>
        <div className="text-center m-2">
          {/* botão que abre o modal */}
          <Button onClick={openPixModal}>Presentear</Button>
        </div>
      </div>

      {/* Modal com Pix */}
      <Modal
        isOpen={open}
        onRequestClose={closePixModal}
        style={customStyles}
        contentLabel="Gerar Pix"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-emerald-700 mb-4">
            🎁 Presentear — {gift.title}
          </h2>

          {/* nosso gerador de Pix */}
          <PixGeneratorFixedEmail
            fixedEmail={siteConfig.pixKey}       // sua chave Pix (fixa)
            defaultAmount={gift.price}              // valor do presente
            merchantName="BRUNA"                    // seu nome
            merchantCity="SAO PAULO"                // cidade
            defaultDesc={`Presente: ${gift.title}`} // descrição
          />

          <button
            onClick={closePixModal}
            className="mt-4 px-4 py-2 rounded bg-white-400 text-emerald-600 border border-emerald-100 rounded-2xl"
          >
            Fechar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GiftCard;
