'use client';

import React, { useState } from 'react';
import styles from './IdActivation.module.css';

const IdActivation = () => {
  const [formData, setFormData] = useState({
    amount: '',
    remarks: '',
    utrNumbers: [''],
    receipt: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeField, setActiveField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleUtrChange = (index, value) => {
    const newUtrNumbers = [...formData.utrNumbers];
    newUtrNumbers[index] = value;
    setFormData(prev => ({
      ...prev,
      utrNumbers: newUtrNumbers
    }));
  };

  const addUtrField = () => {
    setFormData(prev => ({
      ...prev,
      utrNumbers: [...prev.utrNumbers, '']
    }));
  };

  const removeUtrField = (index) => {
    if (formData.utrNumbers.length > 1) {
      const newUtrNumbers = formData.utrNumbers.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        utrNumbers: newUtrNumbers
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image/jpeg')) {
        setErrors(prev => ({
          ...prev,
          receipt: 'Please upload only JPG images'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        receipt: file
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      
      if (errors.receipt) {
        setErrors(prev => ({
          ...prev,
          receipt: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.remarks.trim()) {
      newErrors.remarks = 'Remarks are required';
    }
    
    const validUtrs = formData.utrNumbers.filter(utr => utr.trim() !== '');
    if (validUtrs.length === 0) {
      newErrors.utrNumbers = 'At least one UTR number is required';
    }
    
    if (!formData.receipt) {
      newErrors.receipt = 'Please attach a receipt';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', {
        ...formData,
        utrNumbers: formData.utrNumbers.filter(utr => utr.trim() !== '')
      });
      
      // Show success animation
      const submitBtn = document.querySelector(`.${styles.submitBtn}`);
      if (submitBtn) {
        submitBtn.classList.add(styles.success);
        setTimeout(() => {
          submitBtn.classList.remove(styles.success);
        }, 3000);
      }
      
      setFormData({
        amount: '',
        remarks: '',
        utrNumbers: [''],
        receipt: null
      });
      setPreviewImage(null);
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Animated Background */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <div className={styles.iconWrapper}>
                <i className="fas fa-id-card"></i>
              </div>
              <div>
                <h1>ID Activation</h1>
                <p>Complete your activation request</p>
              </div>
            </div>
            <div className={styles.badge}>
              <span>My Request</span>
              <div className={styles.badgePulse}></div>
            </div>
          </div>
        </div>
        
        <div className={styles.errorBanner}>
          <div className={styles.errorIcon}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className={styles.errorContent}>
            <strong>Connection Error</strong>
            <p>The connection errored: No route to host. This indicates an error which most likely cannot be solved by the library.</p>
          </div>
          <button className={styles.errorClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={`${styles.formGroup} ${activeField === 'amount' ? styles.active : ''}`}>
            <label htmlFor="amount" className={styles.floatingLabel}>Amount</label>
            <div className={styles.inputWithIcon}>
              <i className="fas fa-money-bill-wave"></i>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                onFocus={() => setActiveField('amount')}
                onBlur={() => setActiveField(null)}
                placeholder=" "
                className={errors.amount ? styles.error : ''}
              />
              <span className={styles.currency}>₹</span>
            </div>
            {errors.amount && (
              <div className={styles.errorMessage}>
                <i className="fas fa-exclamation-circle"></i>
                {errors.amount}
              </div>
            )}
          </div>
          
          <div className={`${styles.formGroup} ${activeField === 'remarks' ? styles.active : ''}`}>
            <label htmlFor="remarks" className={styles.floatingLabel}>Remarks</label>
            <div className={styles.inputWithIcon}>
              <i className="fas fa-comment"></i>
              <input
                type="text"
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                onFocus={() => setActiveField('remarks')}
                onBlur={() => setActiveField(null)}
                placeholder=" "
                className={errors.remarks ? styles.error : ''}
              />
            </div>
            {errors.remarks && (
              <div className={styles.errorMessage}>
                <i className="fas fa-exclamation-circle"></i>
                {errors.remarks}
              </div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.sectionLabel}>UTR Numbers</label>
            <div className={styles.utrContainer}>
              {formData.utrNumbers.map((utr, index) => (
                <div key={index} className={styles.utrGroup}>
                  <div className={`${styles.inputWithIcon} ${styles.utrInput}`}>
                    <i className="fas fa-hashtag"></i>
                    <input
                      type="text"
                      value={utr}
                      onChange={(e) => handleUtrChange(index, e.target.value)}
                      placeholder="Enter UTR number"
                    />
                  </div>
                  {formData.utrNumbers.length > 1 && (
                    <button 
                      type="button" 
                      className={styles.removeBtn}
                      onClick={() => removeUtrField(index)}
                      title="Remove UTR"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className={styles.addBtn} onClick={addUtrField}>
                <i className="fas fa-plus"></i> 
                <span>Add Another UTR</span>
              </button>
            </div>
            {errors.utrNumbers && (
              <div className={styles.errorMessage}>
                <i className="fas fa-exclamation-circle"></i>
                {errors.utrNumbers}
              </div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.sectionLabel}>
              Attach Receipt 
              <span className={styles.fileNote}>(Only JPG images accepted)</span>
            </label>
            <div className={styles.fileUpload}>
              <input
                type="file"
                id="receipt"
                accept=".jpg,.jpeg"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <label htmlFor="receipt" className={styles.fileLabel}>
                {previewImage ? (
                  <div className={styles.preview}>
                    <div className={styles.previewImage}>
                      <img src={previewImage} alt="Receipt preview" />
                      <div className={styles.previewOverlay}>
                        <i className="fas fa-sync-alt"></i>
                        <span>Change Image</span>
                      </div>
                    </div>
                    <div className={styles.fileInfo}>
                      <span className={styles.fileName}>{formData.receipt?.name}</span>
                      <span className={styles.fileSize}>
                        {(formData.receipt?.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.uploadArea}>
                    <div className={styles.uploadIcon}>
                      <i className="fas fa-cloud-upload-alt"></i>
                    </div>
                    <div className={styles.uploadText}>
                      <p>Click to upload receipt</p>
                      <span>JPG format only • Max 5MB</span>
                    </div>
                  </div>
                )}
              </label>
            </div>
            {errors.receipt && (
              <div className={styles.errorMessage}>
                <i className="fas fa-exclamation-circle"></i>
                {errors.receipt}
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className={`${styles.submitBtn} ${isSubmitting ? styles.processing : ''}`}
            disabled={isSubmitting}
          >
            <span className={styles.btnContent}>
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Processing Your Request...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Process Activation
                </>
              )}
            </span>
            <div className={styles.btnProgress}></div>
          </button>
        </form>
        
        <div className={styles.footer}>
          <div className={styles.securityNote}>
            <i className="fas fa-shield-alt"></i>
            <span>Your data is securely encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdActivation;