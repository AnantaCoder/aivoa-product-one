import React from 'react';
import type { ComplaintFormData } from '../../types/complaint';

interface ProductIdentificationProps {
  form: Partial<ComplaintFormData>;
  handleChange: (field: keyof ComplaintFormData, value: string) => void;
}

export const ProductIdentification: React.FC<ProductIdentificationProps> = ({ form, handleChange }) => {
  return (
    <section className="form-section">
      <div className="section-label">2. PRODUCT &amp; BATCH IDENTIFICATION</div>
      
      <div className="form-grid-2">
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            id="productName"
            type="text"
            className="form-input"
            placeholder="Awaiting AI extraction..."
            value={form.productName || ''}
            onChange={(e) => handleChange('productName', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="productStrength">Product Strength/Grade</label>
          <input
            id="productStrength"
            type="text"
            className="form-input"
            placeholder="Awaiting AI extraction..."
            value={form.productStrength || ''}
            onChange={(e) => handleChange('productStrength', e.target.value)}
          />
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-group">
          <label htmlFor="batchNumber">Batch/Lot Number</label>
          <input
            id="batchNumber"
            type="text"
            className="form-input"
            placeholder="Awaiting AI extraction..."
            value={form.batchNumber || ''}
            onChange={(e) => handleChange('batchNumber', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="manufacturingDate">Manufacturing Date</label>
          <div className="input-wrapper">
            <input
              id="manufacturingDate"
              type="date"
              className="form-input"
              placeholder="Awaiting AI extraction..."
              value={form.manufacturingDate || ''}
              onChange={(e) => handleChange('manufacturingDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date</label>
          <div className="input-wrapper">
            <input
              id="expiryDate"
              type="date"
              className="form-input"
              placeholder="Awaiting AI extraction..."
              value={form.expiryDate || ''}
              onChange={(e) => handleChange('expiryDate', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="quantityAffected">Quantity Affected</label>
          <div className="input-wrapper">
            <input
              id="quantityAffected"
              type="text"
              className="form-input input-with-suffix"
              placeholder="Awaiting AI extraction..."
              value={form.quantityAffected || ''}
              onChange={(e) => handleChange('quantityAffected', e.target.value)}
            />
            <span className="input-suffix">kg</span>
          </div>
        </div>
      </div>
    </section>
  );
};
