import { render,screen } from '@testing-library/react';    
import '@testing-library/jest-dom'; // Import jest-dom matchers
import Page from "@/app/page";
import React from 'react';

jest.mock('@/components/navbar',()=> ()=><div>Navbar Mock</div>)
jest.mock('@/app/(client)/Scholarship/page',()=> ()=><div>Scholarship Page Mock</div>)

describe('landing page',()=>{
    it('renders the navbar and scholarship page',()=>{
        render(<Page/>);
        expect(screen.getByText('Navbar Mock')).toBeInTheDocument();
        expect(screen.getByText('Scholarship Page Mock')).toBeInTheDocument();
  });
});