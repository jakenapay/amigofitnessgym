import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Keyboard } from 'lucide-react';
import '../../pages/admin/PageShared.css';

const SCANNER_ID = 'amigo-qr-reader';

export default function QrScannerModal({ onResult, onClose }) {
  const [manualMode, setManualMode]   = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [cameraErr, setCameraErr]     = useState('');

  // Stable ref so the scan callback always calls the latest onResult
  // without adding it to the effect dep array (prevents camera restart on every render)
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; });

  useEffect(() => {
    if (manualMode) return;

    let qr      = null;
    let started = false;
    let aborted = false;

    (async () => {
      try {
        qr = new Html5Qrcode(SCANNER_ID);

        const cameras = await Html5Qrcode.getCameras();
        if (aborted) return;
        if (!cameras.length) throw new Error('No camera detected on this device.');

        await qr.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 230, height: 230 } },
          (text) => {
            if (aborted) return;
            aborted = true;
            qr.stop().finally(() => {
              qr = null;
              onResultRef.current(text);
            });
          },
          () => {} // per-frame decode errors are expected — silence them
        );

        if (aborted) {
          try { qr.stop().catch(() => {}); } catch { /* ignore */ }
          return;
        }
        started = true;
      } catch (err) {
        if (aborted) return;
        qr = null;
        const msg =
          err.message?.includes('No camera') ? err.message :
          err.message?.includes('Permission') || err.message?.includes('denied') || err.message?.includes('NotAllowed')
            ? 'Camera access denied. Allow camera in browser settings.'
            : 'Camera unavailable on this device.';
        setCameraErr(msg);
        setManualMode(true);
      }
    })();

    return () => {
      aborted = true;
      if (started && qr) {
        try { qr.stop().catch(() => {}); } catch { /* ignore */ }
      }
      qr      = null;
      started = false;
    };
  }, [manualMode]); // only re-run when toggling between camera and manual

  const submit = () => {
    const val = manualInput.trim();
    if (!val) return;
    onResult(val.toUpperCase());
    setManualInput('');
  };

  return (
    <div className="pm-modal-bg" onClick={onClose}>
      <div className="pm-modal pm-modal--scanner" onClick={e => e.stopPropagation()}>

        <div className="pm-modal__head">
          <h2>Member Check-In</h2>
          <button className="pm-modal__close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="pm-modal__body">
          {!manualMode ? (
            <>
              <p className="scanner-hint">Point the camera at the member's QR code.</p>
              <div className="scanner-viewport-wrap">
                <div id={SCANNER_ID} className="scanner-viewport" />
              </div>
              <button className="scanner-alt-btn" onClick={() => setManualMode(true)}>
                <Keyboard size={12} /> Enter code manually
              </button>
            </>
          ) : (
            <>
              {cameraErr && <p className="scanner-cam-err">{cameraErr}</p>}
              <p className="scanner-hint">Type a member token and press Check In.</p>
              <p className="scanner-demo-note">Demo tokens: AMIGO-001 through AMIGO-012</p>
              <div className="scanner-manual-row">
                <input
                  className="pm-input"
                  placeholder="e.g. AMIGO-003"
                  value={manualInput}
                  onChange={e => setManualInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  autoFocus
                />
                <button className="pm-btn-save scanner-submit-btn" onClick={submit}>
                  Check In
                </button>
              </div>
              {!cameraErr && (
                <button
                  className="scanner-alt-btn"
                  onClick={() => { setManualMode(false); setManualInput(''); }}
                >
                  <Camera size={12} /> Use camera instead
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
