// ServiceCard.jsx
const ServiceCard = ({ service }) => {
  const Icon = service.icon;

  return (
    <div className="card bg-base-100 border  border-[#1cb10828] shadow-md hover:shadow-xl transition duration-300">
      <div className="card-body items-center text-center">
        <div className="text-primary text-4xl mb-4">
          <Icon />
        </div>
        <h3 className="card-title text-lg font-semibold">
          {service.title}
        </h3>
        <p className="text-sm text-gray-600">
          {service.description}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
