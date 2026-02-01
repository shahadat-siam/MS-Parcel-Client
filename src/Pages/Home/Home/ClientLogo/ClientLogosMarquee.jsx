import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";

const logos = [
  "/public/brands/amazon.png",
  "/public/brands/amazon_vector.png",
  "/public/brands/casio.png",
  "/public/brands/moonstar.png",
  "/public/brands/randstad.png",
  "/public/brands/star.png",
  "/public/brands/start_people.png",
];

const ClientLogosMarquee = () => {
  return (
    <section className="py-16 px-10 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-10">
        We've helped thousands of sales teams
      </h2>

      <Marquee
        speed={50}
        pauseOnHover={true}
        gradient={false}
      >
        <div className="flex gap-8 px-6">
          {logos.map((logo, i) => (
            <Link to="/" key={i}>
              <div className="bg-white p-6 mx-8 rounded-lg shadow hover:shadow-lg transition">
                <img
                  src={logo}
                  alt="client logo"
                  className="h-6 w-auto object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </Marquee>
    </section>
  );
};

export default ClientLogosMarquee;
