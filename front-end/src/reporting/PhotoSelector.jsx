import { useEffect, useRef, useState } from 'react'

function PhotoSelector({ photo, onChange }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const photoUrl = photo?.url

  useEffect(() => {
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl)
      }
    }
  }, [photoUrl])

  function selectPhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setError('Choose a JPEG or PNG image.')
      return
    }

    if (file.size > 5_000_000) {
      setError('Choose an image no larger than 5 MB.')
      return
    }

    if (file.size === 0) {
      setError('This file is empty. Choose another image.')
      return
    }

    setError('')
    onChange({
      file,
      url: URL.createObjectURL(file),
      alt: 'Selected barrier photo',
    })
  }

  function removePhoto() {
    setError('')
    onChange(null)
  }

  function handleImageError() {
    setError('This image could not be read. Choose another image.')
    onChange(null)
  }

  return (
    <div className="reporting__field">
      <p id="photo-label" className="reporting__label">
        Photo (optional)
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={selectPhoto}
        hidden
      />

      <button
        type="button"
        className="reporting__photo-picker"
        aria-labelledby="photo-label photo-action"
        aria-describedby="photo-hint photo-rules photo-error"
        onClick={() => inputRef.current.click()}
      >
        <span id="photo-action">
          {photo ? 'Replace photo' : 'Tap to add a photo'}
        </span>
      </button>

      <p id="photo-rules" className="reporting__hint">
        One JPEG or PNG image, up to 5 MB.
      </p>

      <p id="photo-hint" className="reporting__hint">
        Please keep faces and personal details out of photos.
      </p>

      <p id="photo-error" className="reporting__error" role="alert">
        {error}
      </p>

      {photo && (
        <div className="reporting__photo-selection">
          <img
            key={photo.url}
            src={photo.url}
            alt={photo.alt}
            className="reporting__photo reporting__photo-thumbnail"
            onError={handleImageError}
          />

          <span className="reporting__row-value">{photo.file.name}</span>

          <button
            type="button"
            className="reporting__text-button"
            onClick={removePhoto}
          >
            Remove photo
          </button>
        </div>
      )}
    </div>
  )
}

export default PhotoSelector
