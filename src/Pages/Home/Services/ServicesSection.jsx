// ServicesSection.jsx 
import ServiceCard from "./ServiceCard";
import { services } from "./Service";

const ServicesSection = () => {

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Our Services
          </h2>
          <p className="text-gray-600">
            Reliable, fast, and secure logistics solutions designed to help your business grow.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
