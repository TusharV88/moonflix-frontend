import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CircularRate from "../components/common/CircularRate";
import Container from "../components/common/Container";
import ImageHeader from "../components/common/ImageHeader";
import uiConfigs from "../configs/ui.configs";
import tmdbConfigs from "../api/configs/tmdb.configs";
import mediaApi from "../api/modules/media.api";
import favoriteApi from "../api/modules/favorite.api";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { setAuthModalOpen } from "../redux/features/authModalSlice";
import { addFavorite, removeFavorite } from "../redux/features/userSlice";
import CastSlide from "../components/common/CastSlide";
import MediaVideoSlide from "../components/common/MediaVideoSlide";
import BackdropSlide from "../components/common/BackdropSlide";
import PosterSlide from "../components/common/PosterSlide";
import RecommendationSlide from "../components/common/RecommendationSlide";
import MediaSlide from "../components/common/MediaSlide";
import MediaReviews from "../components/common/MediaReviews";
import { isInteger } from "formik";
import NotFound from "./NotFound";

const MediasCheck = (mediaType, mediaId) => {
  if (mediaType !== "movie" && mediaType !== "tv") return false;
  else if (!isInteger(mediaId)) return false;
  return true;

};

const MediaDetail = () => {
  const { mediaType, mediaId } = useParams();
  const Checker = MediasCheck(mediaType, mediaId);

  const { user, listFavorites } = useSelector(state => state.user);
  const [media, setMedia] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [genres, setGenres] = useState([]);

  const dispatch = useDispatch();

  const videoRef = useRef(null);

  useEffect(() => {
    if (Checker) {
      window.scrollTo(0, 0);
      const getMedia = async () => {
        dispatch(setGlobalLoading(true));
        const { response, err } = await mediaApi.getDetail({ mediaType, mediaId });
        dispatch(setGlobalLoading(false));
        if (response) {
          setMedia(response);
          setGenres(response.genres.splice(0, 2));
          setIsFavorite(response.isFavorite);
        }

        if (err) toast.error(err.message);
      }

      getMedia();
    }
  }, [mediaType, mediaId, dispatch, Checker]);

  const onFavoriteClick = async () => {
    if (!user) return dispatch(setAuthModalOpen(true));

    if (onRequest) return;

    if (isFavorite) {
      onRemoveFavorite();
      return;
    }

    setOnRequest(true);

    const body = {
      mediaId: media.id,
      mediaType: mediaType,
      mediaTitle: media.title || media.name,
      mediaPoster: media.poster_path,
      mediaRate: media.vote_average
    }

    const { response, err } = await favoriteApi.add(body);

    setOnRequest(false);

    if (response) {
      dispatch(addFavorite(response));
      setIsFavorite(true);
      toast.success("Added to favorite");
    }

    if (err) toast.error(err.message);

  };

  const onRemoveFavorite = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const favorite = listFavorites.find(favorite => favorite.mediaId.toString() === media.id.toString());

    const { response, err } = await favoriteApi.remove({ favoriteId: favorite.id });

    setOnRequest(false);

    if (response) {
      dispatch(removeFavorite(favorite));
      setIsFavorite(false);
      toast.success("Removed from favorite");
    }

    if (err) toast.error(err.message);

  };


  return (
    Checker ? (
      <>
        {media ? (
          <>
            <ImageHeader imgPath={tmdbConfigs.backdropPath(media.backdrop_path || media.poster_path)} />
            <Box sx={{
              color: "primary.contrastText",
              ...uiConfigs.style.mainContent
            }}>
              {/* Media Content */}
              <Box sx={{
                marginTop: { xs: "-10rem", md: "-15rem", lg: "-20rem" }
              }}>
                <Box sx={{
                  display: "flex",
                  flexDirection: { md: "row", xs: "column" }
                }}>
                  {/* Poster */}
                  <Box sx={{
                    width: { xs: "70%", sm: "50%", md: "40%" },
                    margin: { xs: "0 auto 2rem", md: "0 2rem 0 0" }
                  }}>
                    <Box sx={{
                      paddingTop: "140%",
                      ...uiConfigs.style.backgroundImage(tmdbConfigs.posterPath(media.poster_path || media.backdrop_path))
                    }} />
                  </Box>
                  {/* Poster */}
                  {/* Media Info */}
                  <Box sx={{
                    width: { xs: "100%", md: "60%" },
                    color: "text.primary"
                  }}>
                    <Stack spacing={5}>
                      {/* Title */}
                      <Typography
                        variant="h4"
                        fontSize={{ xs: "2rem", md: "2rem", lg: "4rem" }}
                        fontWeight="700"
                        sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                      >
                        {`${media.title || media.name} ${mediaType === tmdbConfigs.mediaType.movie ? media.release_date.split("-")[0] : media.first_air_date.split("-")[0]}`}
                      </Typography>
                      {/* Title */}
                      {/* Rate and Genre */}
                      <Stack direction="row" spacing={1} alignItems="center">
                        {/* Rate */}
                        <CircularRate value={media.vote_average} />
                        {/* Rate */}
                        <Divider orientation="vertical" />
                        {/* Genre */}
                        {genres.map((genre, index) => (
                          <Chip
                            key={index}
                            label={genre.name}
                            variant="filled"
                            color="primary"
                          />
                        ))}
                        {/* Genre */}
                      </Stack>
                      {/* Rate and Genre */}
                      {/* Overview */}
                      <Typography
                        variant="body1"
                        sx={{ ...uiConfigs.style.typoLines(5) }}
                      >
                        {media.overview}
                      </Typography>
                      {/* Overview */}
                      {/* Buttons */}
                      <Stack direction="row" spacing={1}>
                        <LoadingButton
                          variant="text"
                          sx={{
                            width: "max-content",
                            "&.MuiButton-root": { marginRight: "0" }
                          }}
                          size="large"
                          startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                          loadingPosition="start"
                          loading={onRequest}
                          onClick={onFavoriteClick}
                        />
                        <Button
                          variant="contained"
                          sx={{ width: "max-content" }}
                          size="large"
                          startIcon={<PlayArrowIcon />}
                          onClick={() => videoRef.current.scrollIntoView({ behavior: "smooth" })}
                        >
                          Play Trailer
                        </Button>
                      </Stack>
                      {/* Buttons */}
                      {/* Cast */}
                      <Container header="Cast" >
                        <CastSlide casts={media.credits.cast} />
                      </Container>
                      {/* Cast */}
                    </Stack>
                  </Box>
                  {/* Media Info */}
                </Box>
              </Box>
              {/* Media Content */}
              {/* Media Videos */}
              <div ref={videoRef} style={{ paddingTop: "2rem" }}>
                <Container header="Videos">
                  <MediaVideoSlide videos={[...media.videos.results].splice(0, 5)} />
                </Container>
              </div>
              {/* Media Videos */}
              {/* Media Backdrop */}
              {media.images.backdrops.length > 0 && (
                <Container header="Backdrops">
                  <BackdropSlide backdrops={media.images.backdrops} />
                </Container>
              )}
              {/* Media Backdrop */}
              {/* Media Poster */}
              {media.images.posters.length > 0 && (
                <Container header="Posters">
                  <PosterSlide posters={media.images.posters} />
                </Container>
              )}
              {/* Media Poster */}
              {/* Media Reviews */}
              <MediaReviews reviews={media.reviews} media={media} mediaType={mediaType} />
              {/* Media Reviews */}
              {/* Media Recommendations */}
              <Container header="you may also like">
                {media.recommend.length > 0 && (
                  <RecommendationSlide medias={media.recommend} mediaType={mediaType} />
                )}
                {media.recommend.length === 0 && (
                  <MediaSlide
                    mediaCategory={tmdbConfigs.mediaCategory.top_rated}
                    mediaType={mediaType}
                  />
                )}
              </Container>
              {/* Media Recommendations */}
            </Box>
          </>
        ) : null
        }
      </>
    ) : <NotFound />
  )
};

export default MediaDetail;