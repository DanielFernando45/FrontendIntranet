import React from "react";
import LayoutApp from "../../../layout/LayoutApp";
import perfil from "../../../assets/icons/PerfilIcon.svg";
import flecha from "../../../assets/icons/Flecha.svg";

const MiPerfilEdit = () => {
  return (
    <LayoutApp>
      <main className="m-32">
        <div className="ml-8 fondo_login rounded-t-[20px] w-full h-14 "> </div>
        <div className="flex flex-col  gap-[40px] ml-8  pb-12 pt-[38px] w-full h-full px-5 bg-white rounded-b-[20px] ">
          <div className="flex justify-between ">
            <div className="bg-[#E1DEDF] flex  px-10 py-[9px]  rounded-3xl">
              <div className="flex px-10 gap-[48px] items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="94"
                  height="94"
                  viewBox="0 0 33 32"
                  fill="none"
                >
                  <path
                    d="M28.173 6.2546H27.0458L27.0456 5.1272C27.0456 4.45084 26.5948 4 25.9184 4C25.242 4 24.7912 4.45084 24.7912 5.1272V6.2544H23.664C22.9876 6.2544 22.5368 6.70525 22.5368 7.38161C22.5368 8.05797 22.9876 8.50881 23.664 8.50881H24.7912V9.63601C24.7912 10.3124 25.242 10.7632 25.9184 10.7632C26.5948 10.7632 27.0456 10.3124 27.0456 9.63601V8.509H28.1728C28.8492 8.509 29.3 8.05816 29.3 7.3818C29.3002 6.70544 28.8493 6.2546 28.173 6.2546H28.173ZM15.7729 16.4C14.5328 16.4 13.5183 17.4145 13.5183 18.6546C13.5183 19.8947 14.5328 20.9092 15.7729 20.9092C17.0129 20.9092 18.0275 19.8947 18.0275 18.6546C18.0275 17.4145 17.0129 16.4 15.7729 16.4ZM23.6636 11.8908H22.1982L21.86 10.8763C21.7474 10.5381 21.6345 10.3126 21.4092 9.97438V9.86172L21.2965 9.74906C20.62 8.96004 19.7183 8.509 18.7038 8.509H12.8416C12.2781 8.509 11.6018 8.73452 11.1507 9.0727C11.0381 9.0727 11.0381 9.18536 10.9252 9.18536C10.3617 9.63639 9.91088 10.1999 9.68536 10.8763L9.34718 11.8908H7.8818C5.96538 11.8908 4.5 13.3562 4.5 15.2726V24.2909C4.5 26.2073 5.96538 27.6727 7.8818 27.6727H23.6637C25.5801 27.6727 27.0455 26.2073 27.0455 24.2909V15.2726C27.0453 13.3564 25.5799 11.8908 23.6635 11.8908H23.6636ZM15.7729 23.1638C13.293 23.1638 11.2639 21.1347 11.2639 18.6548C11.2639 16.1749 13.293 14.1458 15.7729 14.1458C18.2528 14.1458 20.2819 16.1749 20.2819 18.6548C20.2819 21.1347 18.2528 23.1638 15.7729 23.1638Z"
                    fill="#2B2829"
                  />
                </svg>

                <h3 className="text-center">
                  Allowed format <br></br> JPG, JPEG, and PNG
                </h3>
                <p className="text-center">
                  Max file size <br></br> 2MB
                </p>
              </div>
            </div>

            <div className="flex gap-5 ">
              <div className="flex justify-center items-center text-[#1C1C34] bg-[#D2CECF] rounded-lg w-[87px] h-[41px]">
                Cancelar
              </div>
              <div className="flex justify-center items-center text-white  bg-[#1C1C34] rounded-lg w-[87px] h-[41px]">
                Guardar
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex  gap-10 ">
              <div className="flex flex-col gap-3 w-full">
                <p className="pl-[1px]">Correo electrónico</p>
                <div className="flex bg-[#F9F9F9] w-full h-[49px] rounded-lg items-center p-4">
                  alonsoCastro14@gmail.com
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <p className="pl-[1px]">Pais</p>
                <div className="flex bg-[#F9F9F9] w-full h-[49px] justify-between rounded-lg  items-center p-4">
                  Peru
                  <img src={flecha} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LayoutApp>
  );
};

export default MiPerfilEdit;
