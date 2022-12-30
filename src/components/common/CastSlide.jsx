import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import uiConfigs from "../../configs/ui.configs";
import { routesGen } from "../../routes/routes";


const CastSlide = ({ casts }) => {
    return (
        <Box
            sx={{ "& .swiper-slide": { width: { xs: "50%", md: "25%", lg: "20.5%" }, color: "primary.contrastText" } }}
        >
            <Swiper
                slidesPerView={5}
                spaceBetween={10}
                breakpoints={{
                    0: { slidesPerView: 2 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                }}
            >
                {casts.map((cast, index) => (
                    <SwiperSlide key={index}>
                        <Link to={routesGen.person(cast.id)}>
                            <Box
                                sx={{
                                    paddingTop: "120%",
                                    color: "text.primary",
                                    ...uiConfigs.style.backgroundImage(tmdbConfigs.posterPath(cast.profile_path)),
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        width: "100%",
                                        padding: "0.5rem",
                                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                                    }}
                                >
                                    <Typography variant="body2" fontWeight="700" sx={{ ...uiConfigs.style.typoLines(1, "center") }}>
                                        {cast.name}
                                    </Typography>
                                    <Typography variant="body2" fontWeight="700" sx={{ ...uiConfigs.style.typoLines(1, "center") }}>
                                        {cast.character}
                                    </Typography>
                                </Box>
                            </Box>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    )
};

export default CastSlide;