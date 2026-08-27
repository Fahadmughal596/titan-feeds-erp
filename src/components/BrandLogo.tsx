import titanLogo from '../assets/titan-feeds-logo.png';

export default function BrandLogo({compact=false}:{compact?:boolean}){
  return (
    <div className={compact?'titan-logo compact':'titan-logo'} aria-label="Titan Feeds">
      <img src={titanLogo} alt="Titan Feeds" />
    </div>
  );
}
