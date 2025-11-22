import React from 'react';
import { NavLink } from 'react-router-dom';
import { SparklesIcon } from './icons/SparklesIcon';

const Footer: React.FC = () => {
  const linkClasses = "text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark transition-colors";

  return (
    <footer className="bg-secondary dark:bg-black/20 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding */}
          <div className="md:col-span-1">
            <NavLink to="/" className="flex items-center space-x-2 mb-4">
              <SparklesIcon className="h-8 w-8 text-primary dark:text-primary-dark" />
              <span className="font-display font-bold text-2xl text-light-text dark:text-dark-text">
                GritGrade
              </span>
            </NavLink>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Comprehensive content quality audit platform for content creators and SEO professionals.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-light-text dark:text-dark-text mb-4">Linkedin</h3>
            <ul className="space-y-2">
              <li><a href="https://www.linkedin.com/in/manikanta-v-948685387/" className={linkClasses}>V Manikanta</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-light-text dark:text-dark-text mb-4">Instagram</h3>
            <ul className="space-y-2">
              <li><a href="https://www.instagram.com/v_s_mani_39/" className={linkClasses}>v_s_mani_39</a></li>
              <li><a href="https://www.instagram.com/__the_god_of_genjutsu_007__/" className={linkClasses}>__the_god_of_genjutsu_007__</a></li>
              <li><a href="https://www.instagram.com/one_and_only_jac/" className={linkClasses}>one_and_only_jac</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-light-text dark:text-dark-text mb-4">Email</h3>
            <ul className="space-y-2">
              <li><a href="#" className={linkClasses}>manikantav059@gmail.com</a></li>
              <li><a href="#" className={linkClasses}></a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} GritGrade.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
