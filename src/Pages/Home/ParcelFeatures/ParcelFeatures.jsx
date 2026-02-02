const features = [
  {
    id: 1,
    title: "Real-Time Parcel Tracking",
    description:
      "Track your parcel live from dispatch to doorstep. Get real-time updates, location insights, and delivery status.",
    image: "/features/Transit warehouse.png",
  },
  {
    id: 2,
    title: "Smart Shipment Tracking",
    description:
      "Monitor your shipments effortlessly with instant tracking updates and complete transparency.",
    image: "/features/Vector.png",
  },
  {
    id: 3,
    title: "24/7 Call Center Support",
    description:
      "Get round-the-clock customer support for all your parcel-related queries anytime, anywhere.",
    image: "/features/Vector.png",
  },
];

const ParcelFeatures = () => {
  return (
    <div  className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {features.map((item) => (
        <div data-aos="zoom-in-up"
          key={item.id}
          className="card bg-base-100 shadow-md hover:shadow-lg transition"
        >
          <div className="card-body">
            <div className="flex items-center gap-8">

              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-36 h-36 object-contain"
              />

              {/* Stylish Vertical Divider */}
              <div className="w-[1px] md:w-[2px] self-stretch bg-gradient-to-b from-gray-300 via-gray-300 to-gray-300"></div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParcelFeatures;
