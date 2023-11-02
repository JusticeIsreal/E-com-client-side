import { Carousel } from "@mantine/carousel";
import { Blockquote } from "@mantine/core";

function Review() {
  return (
    <div className="review-main-con">
      <h1>REVIEWS</h1>
      <Carousel
        withIndicators
        height={200}
        slideSize="33.333333%"
        slideGap="md"
        dragFree
        loop
        align="start"
        breakpoints={[
          { maxWidth: "md", slideSize: "50%" },
          { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
        ]}
      >
        <Carousel.Slide>
          <div className="review">
            <div className="review-con">
              <div className="review-text">
                <Blockquote cite="– Kola Ibrahim">
                  <p>
                    This website is amazing! They have the best customer
                    serveice response available. I received my order without
                    stress. Highly recommended!
                  </p>
                </Blockquote>
              </div>
            </div>
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className="review">
            <div className="review-con">
              <div className="review-text">
                <Blockquote cite="– James Osadolor">
                  <p>
                    I can't believe how fast they deliver! I ordered my product
                    and it arrived in just 2 days. Fantastic service and great .
                  </p>
                </Blockquote>
              </div>
            </div>
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className="review">
            <div className="review-con">
              <div className="review-text">
                <Blockquote cite="– Nosa Ogbons">
                  <p>
                    This e-commerce website is a gem! They offer a wide range of
                    products, and their delivery is lightning fast. Couldn't be
                    happier!{" "}
                  </p>
                </Blockquote>
              </div>
            </div>
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className="review">
            <div className="review-con">
              <div className="review-text">
                <Blockquote cite="– Godwin Okpo">
                  <p>
                    I'm thrilled with my shopping experience on this website! it
                    is easy to navigate and the response time of the admin is
                    fast.
                  </p>
                </Blockquote>
              </div>
            </div>
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className="review">
            <div className="review-con">
              <div className="review-text">
                <Blockquote cite="– Sandra Jones">
                  <p>
                    this is the best place to get all you fashion out fit, they
                    delivered in 2 days , no story
                  </p>
                </Blockquote>
              </div>
            </div>
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className="review">
            <div className="review-con">
              <div className="review-text">
                <Blockquote cite="– Taofiq Salem">
                  <p>
                    I've never experienced such fast delivery before! This
                    website offers top-notch software choices, and I received my
                    order in my email. Highly recommend!
                  </p>
                </Blockquote>
              </div>
            </div>
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className="review">
            <div className="review-con">
              <div className="review-text">
                <Blockquote cite="– Emaka Chuks">
                  <p>
                    No need to look elsewhere for software needs! This website
                    has it all. I placed my order, and to my surprise, it
                    arrived in just 2 days. Exceptional service!
                  </p>
                </Blockquote>
              </div>
            </div>
          </div>
        </Carousel.Slide>
      </Carousel>
    </div>
  );
}

export default Review;
