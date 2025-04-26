"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="
                            fixed 
                            inset-0 
                            bg-gray-500/75 
                            transition-opacity
                        "
          />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className="
                        fixed
                        inset-0
                        flex
                        items-center
                        justify-center
                        p-4
                        text-center
                        sm:p-0
                    "
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {/* Modal panel */}
              <Dialog.Panel
                className="
                                relative
                                transform
                                overflow-hidden
                                rounded-lg
                                bg-white
                                px-4
                                pb-4
                                text-left
                                shadow-xl
                                transition-all
                                w-full
                                sm:my-8
                                sm:w-full
                                sm:max-w-lg
                                sm:p-6
                            "
              >
                {/* Close button container */}
                <div
                  className="
                                    absolute
                                    right-0
                                    hidden
                                    pr-4
                                    sm:block
                                    z-10
                                "
                >
                  <button
                    className="
                                    cursor-pointer
                                    rounded-md
                                    bg-white
                                    text-gray-400
                                    hover:text-gray-500
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-sky-500
                                    focus:ring-offset-2
                                "
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <IoClose className="h-6 w-6" />
                  </button>
                </div>

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
